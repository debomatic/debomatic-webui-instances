function Preferences() {

  // update config.preferences according with user choices
  var load = function () {
    for (key in config.preferences) {
      if ((value = localStorage.getItem(key))) {
        debug(2, 'loading preference', key, value)
        config.preferences[key] = JSON.parse(value)
      }
    }
  }

  // set prefence
  var set = function (key, value) {
    if (config.preferences.hasOwnProperty(key)) {
      debug(1, 'setting preference', key, value)
      localStorage.setItem(key, value)
      config.preferences[key] = JSON.parse(value)
    }
  }

  // init prefence page
  this.initPage = function() {

    $(window).on('load', function() {

      // set view according with config.preferences
      for (key in config.preferences) {
        var element = $("#preferences #" + key)
        if (element.attr('type') == "checkbox") {
          element.prop('checked', config.preferences[key])
        }
        else {
          element.val(config.preferences[key])
        }

      }

      // on input change, set prefence
      $("#preferences input, #preferences select").change(function() {
        var key = $(this).attr('id')
        var value = $(this).val()
        if ($(this).attr('type') == 'checkbox')
          value = $(this).is(':checked')
        set(key,value)
      })

    })
  }

  load()

}