require('./lib/donut-chart.js');
require('./lib/nouislider.js');

/**
  * Portman Calculator
  * --------------------------------------------------
  */

 ;(function(window, document, undefined) {

    'use strict';
  
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
  
  })(window, document);
  
  