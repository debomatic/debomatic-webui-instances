var Page_Distrubion = {

  title: {
    set: function(data) {
      if (! data)
        data = Utils.from_hash_to_data()
      label = ''
      if (Utils.check_data_file(data)) {
        complete_name = data.package.orig_name + '.' + data.file.name
        if (! data.file.path)
          data.file.path = DEBOMATIC_STATIC + '/' + data.distribution.name + '/pool/' + data.package.orig_name + '/' + complete_name
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
  },

  packages: {
    set: function (data) {
      $('#packages ul').html('')
      tmp = data
      tmp.file = null
      data.distribution.packages.forEach(function(p){
        tmp.package = p
        $('#packages ul').append('<li id="package-' + p.orig_name + '"><a href="' + Utils.from_data_to_hash(tmp) + '">'+ p.name + ' <span>'+p.version+'</span></a></li>')
      })
      Page_Distrubion.select(data)
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
      Page_Distrubion.packages.unselect()
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_package(data)) {
        $("#packages li[id='package-"+ data.package.orig_name + "']").addClass('active')
      }
    },
    unselect: function() {
      $('#packages li').removeClass('active')
    }
  },

  files: {
    set: function (data) {
      Page_Distrubion.files.clean()
      tmp = data
      if (data.package.files && data.package.files.length > 0) {
        selected_file = Utils.check_data_file(data)
        data.package.files.forEach(function(f){
          tmp.file = f
          file = $('<li id="file-'+ f.orig_name +'"><a title="'+ f.orig_name +'" href="'+ Utils.from_data_to_hash(tmp) + '">' + f.name + '</a></li>')
          file.on("click", function(){
            Page_Distrubion.files.select(this)
          })
          $('#logs ul').append(file)
        })
        $('#logs').show()
        Page_Distrubion.select()
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
      Page_Distrubion.files.unselect()
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_file(data)) {
        $("#logs li[id='file-" + data.file.orig_name + "']").addClass('active')
      }
    },
    unselect: function() {
        $('#logs li').removeClass('active');
    }
  },
  
  file: {
    set: function(data) {
      $("#file pre").html(data.file.content)
      $("#file").show()
      Page_Distrubion.select()
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
  },
  
  breadcrumb: {
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
  },
  
  // stiky sidebar
  sticky: function() {
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
  },
  
  select: function(data) {
      Page_Distrubion.unselect()
      if (! data)
        data = Utils.from_hash_to_data()
      if (Utils.check_data_distribution(data)) {
        $("#distributions li[id='distribution-"  + data.distribution.name + "']").addClass('active')
      }
      Page_Distrubion.packages.select(data)
      Page_Distrubion.files.select(data)
  },
  
  unselect: function() {
    $('#distributions li').removeClass('active')
    Page_Distrubion.files.unselect()
    Page_Distrubion.packages.unselect()
  },
  
  clean: function() {
    Page_Distrubion.title.clean()
    Page_Distrubion.packages.clean()
    Page_Distrubion.files.clean()
    Page_Distrubion.file.clean()
    Page_Distrubion.unselect()
    Page_Distrubion.breadcrumb.update()
  },
  
  update: function(data, old_data) {
    if (! old_data ) {
      if (! data )
        Page_Distrubion.populate()
      else
        Page_Distrubion.populate(data)
      return;
    }
    else {
      if (! Utils.check_data_distribution(old_data) ||
          ! Utils.check_data_distribution(data) ||
          data.distribution.name != old_data.distribution.name) 
      {
        Page_Distrubion.clean()
        Page_Distrubion.populate(data)
      }
      else if (
        ! Utils.check_data_package(old_data) ||
        ! Utils.check_data_package(data) ||
        data.package.orig_name != old_data.package.orig_name )
      {
        Page_Distrubion.file.clean()
        Page_Distrubion.files.clean()
        Page_Distrubion.files.get(data)
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
        Page_Distrubion.file.get()
      }
      Page_Distrubion.title.set(data)
      Page_Distrubion.breadcrumb.update()
      Page_Distrubion.select(data)
      Page_Distrubion.sticky()
    }
  },
  
  populate: function (data) {
    Page_Distrubion.clean()
    if (! data )
      data = Utils.from_hash_to_data()
    Page_Distrubion.packages.get(data)
    Page_Distrubion.files.get(data)
    Page_Distrubion.file.get(data)
    Page_Distrubion.select(data)
    Page_Distrubion.breadcrumb.update()
    Page_Distrubion.title.set(data)
    Page_Distrubion.sticky()
  }
}
