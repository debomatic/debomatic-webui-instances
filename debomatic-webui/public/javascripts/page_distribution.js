function Page_Distrubion()
{
  var socket
  var data = Utils.from_hash_to_data()

  function __check_hash_makes_sense() {
    if (! window.location.hash)
      window.location.pathname = '/'
    info = window.location.hash.split('/')
    if (info.length == 2)
      window.location.hash = info[0]
  }

  var title = {
    set: function(data) {
      if (! data)
        data = Utils.from_hash_to_data()
      label = ''
      if (Utils.check_data_file(data)) {
        complete_name = data.package.orig_name + '.' + data.file.name
        if (! data.file.path)
          data.file.path = PATHS.debomatic + '/' + data.distribution.name + '/pool/' + data.package.orig_name + '/' + complete_name
        label = complete_name + ' \
          <a class="btn btn-link btn-lg" title="Download" href="' + data.file.path + '">\
            <span class="glyphicon glyphicon-download-alt"></span>\
          </a>'
      }
      else if (Utils.check_data_package(data))
        label = data.package.orig_name
      else if (Utils.check_data_distribution(data))
        label = data.distribution.name
      $('#title').html(label)
    },
    clean: function() {
      $('#title').html('')
    }
  }

  var packages = {
    set: function (data) {
      $('#packages ul').html('')
      tmp = data
      tmp.file = null
      data.distribution.packages.forEach(function(p){
        tmp.package = p
        $('#packages ul').append('<li id="package-' + p.orig_name + '"><a href="' + Utils.from_data_to_hash(tmp) + '">'+ p.name + ' <span>'+p.version+'</span></a></li>')
      })
      select(data)
    },
    
    clean: function () {
      $('#packages ul').html('')
    },
    get: function (data) {
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_distribution(data)) {
        new_data = {}
        new_data.distribution = data.distribution
        socket.emit("get_distribution_packages", new_data)
      }
    },
    select: function(data) {
      packages.unselect()
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_package(data)) {
        $("#packages li[id='package-"+ data.package.orig_name + "']").addClass('active')
      }
    },
    unselect: function() {
      $('#packages li').removeClass('active')
    }
  }

  var files = {
    set: function (data) {
      files.clean()
      tmp = data
      if (data.package.files && data.package.files.length > 0) {
        selected_file = Utils.check_data_file(data)
        data.package.files.forEach(function(f){
          tmp.file = f
          current_file = $('<li id="file-'+ f.orig_name +'"><a title="'+ f.orig_name +'" href="'+ Utils.from_data_to_hash(tmp) + '">' + f.name + '</a></li>')
          current_file.on("click", function(){
            files.select(this)
          })
          $('#logs ul').append(file)
        })
        $('#logs').show()
        select()
      }
      
      if (data.package.debs && data.package.debs.length > 0) {
        data.package.debs.forEach(function(f){
          $('#debs ul').append('<li><a title="'+ f.orig_name +'" href="' + f.path + '">' + f.name  +'</a> <span>.' + f.label + '</span></li>')
        })
        $('#debs').show()
      }
      
      if (data.package.sources && data.package.sources.length > 0) {
        data.package.sources.forEach(function(f){
          $('#sources ul').append('<li><a title="'+ f.orig_name +'" href="' + f.path + '">' + f.name  +'</a></li>')
        })
        $('#sources').show()
      }
      $('#files').show()
    },
    clean: function() {
      $('#logs ul').html('');
      $('#logs').hide()
      $('#debs ul').html('');
      $('#debs').hide();
      $('#sources ul').html('')
      $('#sources').hide()
      $('#files').hide()
    },
    get: function (data) {
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_package(data)) {
        new_data = {}
        new_data.distribution = data.distribution
        new_data.package = data.package
        socket.emit("get_package_files_list", new_data)
      }
    },
    select: function(data) {
      files.unselect()
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_file(data)) {
        $("#logs li[id='file-" + data.file.orig_name + "']").addClass('active')
      }
    },
    unselect: function() {
        $('#logs li').removeClass('active');
    }
  }
  
  var file = {
    set: function(data) {
      $("#file pre").html(data.file.content)
      $("#file").show()
      select()
    },
    clean: function() {
      $('#file pre').html('')
      $('#file').hide()
    },
    append: function(data) {
      new_html =  $("#file pre").html() + data.file.new_content
      $("#file pre").html(new_html)
      
      if (AUTOSCROLL) // scroll down
        $('body,html').animate({ scrollTop: $('#file pre').height() }, 500);
    },
    get: function(data) {
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_file(data)) {
        new_data = {}
        new_data.distribution = data.distribution
        new_data.package = data.package
        new_data.file = data.file
        new_data.file.content = null
        socket.emit("get_file", new_data)
      }
    }
  }
  
  var breadcrumb = {
    update: function(hash) {
      if (! hash )
        hash = window.location.hash
      hash = hash.replace('#', '')
      new_html = '<li><a href="/">home</a></li>'
      new_hash = '#'
      info = hash.split('/')
      for (var i = 0; i < info.length ; i++) {
        new_hash += info[i]
        if (i == (info.length - 1))
          new_html += '<li class="active">' + info[i] + '</li>'
        else
          new_html += '<li><a href="' + new_hash + '">' + info[i] + '</a>'
        new_hash += '/'
      }
      $('.breadcrumb').html(new_html)
    }
  }
  
  // stiky sidebar
  var sticky = function() {
//    $(window).off("scroll")
//    // back on top
////    $("html, body").animate({scrollTop: 0}, 0);
//    var offset = $("#sticky").offset();
//    $(window).scroll(function() {
//      if ($(window).scrollTop() > offset.top)
//        $("#sticky").stop().addClass('fixed');
//      else 
//        $("#sticky").stop().removeClass('fixed');
//    })
  }
  
  var select = function(data) {
      unselect()
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_distribution(data)) {
        $("#distributions li[id='distribution-"  + data.distribution.name + "']").addClass('active')
      }
      packages.select(data)
      files.select(data)
  }
  
  var unselect = function() {
    $('#distributions li').removeClass('active')
    files.unselect()
    packages.unselect()
  }
  
  var clean = function() {
    title.clean()
    packages.clean()
    files.clean()
    file.clean()
    unselect()
    breadcrumb.update()
  }
  
  var update = function(data, old_data) {
    if (! old_data ) {
      if (! data )
        populate()
      else
        populate(data)
      return;
    }
    else {
      if (! Utils.check_data_distribution(old_data) ||
          ! Utils.check_data_distribution(data) ||
          data.distribution.name != old_data.distribution.name) 
      {
        clean()
        populate(data)
      }
      else if (
        ! Utils.check_data_package(old_data) ||
        ! Utils.check_data_package(data) ||
        data.package.orig_name != old_data.package.orig_name )
      {
        file.clean()
        files.clean()
        files.get(data)
        if (Utils.check_data_package(data)) {
          // I will always get dataestamp from package
          window.location.hash += '/datestamp'
        }
      }
      else if (
        ! Utils.check_data_file(old_data) ||
        ! Utils.check_data_file(data) ||
        data.file.name != old_data.file.name
      )
      {
        file.get()
      }
      title.set(data)
      breadcrumb.update()
      select(data)
      sticky()
    }
  }
  
  var populate = function (data) {
    clean()
    if (! data )
      data = Utils.from_hash_to_data()
    packages.get(data)
    files.get(data)
    file.get(data)
    select(data)
    breadcrumb.update()
    title.set(data)
    sticky()
  }

  this.init = function (mysocket) {

    socket = mysocket

    socket.on('distribution_packages', function(data){
      packages.set(data)
    })

    socket.on('package_files_list', function(data){
      files.set(data)
    })

    socket.on('file', function (data) {
      file.set(data)
    })

    socket.on('file_newcontent', function(data) {
      file.append(data)
    })

    $(window).on('hashchange', function() {
      __check_hash_makes_sense()
      new_data = Utils.from_hash_to_data()
      update(new_data, data)
      data = new_data
    });

    $(window).on('load', function (){
      __check_hash_makes_sense()
      populate(data)
    });
  }

}
