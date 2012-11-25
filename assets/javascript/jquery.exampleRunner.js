(function ($) {
    'use strict';
    var pluginName = 'exampleRunner',
        defaults = {
            propertyName: "value"
        };

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        var currentPluggin = this;

        this.runExample = function () {
          //new Function(target.find('code').text())();
          var runResults = eval($(element).find('code').text());
	  if(runResults) {
	    $(element).append('<div class="results-container"><div>results:</div><pre class="run-results"></pre></div>');
            $('.run-results').html(runResults);
	  }
        };

        this.addRunButton = function () {
          $(element).append('<input type="submit" class="run-button" name="runner" value="run"></input>');
	  $('.run-button').click(function() {
	    currentPluggin.runExample();
	    return false;
	  });
	};

        this.init();
        return this;
    }

    Plugin.prototype.init = function () {
      this.addRunButton();
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

}(jQuery));

$('.js-runner').exampleRunner({});