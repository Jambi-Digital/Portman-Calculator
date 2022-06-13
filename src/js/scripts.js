require('./lib/donut-chart.js');
require('./lib/nouislider.js');

/**
  * Portman Calculator
  * --------------------------------------------------
  */
 var PortmanCalculator = PortmanCalculator || {
  
    init: function(options) {

      this.settings(options);       
      this.build();

    },  
     
    settings: function(options) {

      this.config = {
          utm_source: options.utm_source ? options.utm_source : this.config.utm_source,
          utm_medium: options.utm_medium ? options.utm_medium : this.config.utm_medium,
          utm_campaign: options.utm_campaign ? options.utm_campaign : this.config.utm_campaign,
      };

    },

    build: function() {
   
    }, 

  }; 

  window.PortmanCalculator = PortmanCalculator;
  if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
      function F() {}
      F.prototype = obj;
      return new F();
    };
  }
  