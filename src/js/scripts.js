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
            this.defaults();
            this.settings(options);       
            this.build();
            this.events();
            this.dump();
        },  

        defaults: function() {
            this.defaults = {
                borrowing_amount: 0.9,
                min_interest_rate: 0.039,
                max_interest_rate: 0.099,
                submit_url: 'https://portmanassetfinance.com#form',
                logo_image_url: 'https://www.portmanassetfinance.co.uk/wp-content/uploads/2022/05/Portman-Logo-2022-White-Bold.svg',
                background_colour: '#0e212f',
                text_colour: '#ffffff',
                accent_colour_one: '#00dcb4',
                accent_colour_two: '#184363',
            };
        },
       
        settings: function(options) {  
            if (options.utm_source && options.utm_medium && options.utm_campaign) {
                this.config = {
                    borrowing_amount: options.borrowing_amount ? options.borrowing_amount : this.defaults.borrowing_amount,
                    min_interest_rate: options.min_interest_rate ? options.min_interest_rate : this.defaults.min_interest_rate,
                    max_interest_rate: options.max_interest_rate ? options.max_interest_rate : this.defaults.max_interest_rate,
                    submit_url: options.submit_url ? options.submit_url : this.defaults.submit_url,
                    logo_image_url: options.logo_image_url ? options.logo_image_url : this.defaults.logo_image_url,
                    background_colour: options.background_colour ? options.background_colour : this.defaults.background_colour,
                    text_colour: options.text_colour ? options.text_colour : this.defaults.text_colour,
                    accent_colour_one: options.accent_colour_one ? options.accent_colour_one : this.defaults.accent_colour_one,
                    accent_colour_two: options.accent_colour_two ? options.accent_colour_two : this.defaults.accent_colour_two,
                    utm_source: options.utm_source ? options.utm_source : this.config.utm_source,
                    utm_medium: options.utm_medium ? options.utm_medium : this.config.utm_medium,
                    utm_campaign: options.utm_campaign ? options.utm_campaign : this.config.utm_campaign,
                };
            }
            else {
                throw 'The utm_source, utm_medium, and utm_campaign fields are all required when using the Portman Calculator. Please specify these fields in the object parameter of the init() function';
            }
            
    
        },

        build: function(itemPrice = false, borrowingAmount = false, minInterestRate = false, maxInterestRate = false, submitUrl = false) {      
            var itemPrice = itemPrice ? itemPrice : '';
            var borrowingAmount = borrowingAmount ? borrowingAmount : this.config.borrowing_amount;
            var minInterestRate = minInterestRate ? minInterestRate : this.config.min_interest_rate;
            var maxInterestRate = maxInterestRate ? maxInterestRate : this.config.max_interest_rate;
            var submitUrl = submitUrl ? submitUrl : this.config.submitUrl;
            
            var logoImageUrl = this.config.logo_image_url;
            var backgroundColour = this.config.background_colour;
            var textColour = this.config.text_colour;
            var accentColour = this.config.accent_colour_one;
            var accentColourTwo = this.config.accent_colour_two;
            var utmSource = this.config.utm_source;
            var utmMedium = this.config.utm_medium;
            var utmCampaign = this.config.utm_campaign;

            var calcDiv = document.getElementById("portman-calculator");
            if (calcDiv) {
                calcDiv.remove();
            }

            var overlay = document.getElementById("portman-overlay");
            if (overlay) {
                overlay.remove();
            }
            
            var calcDiv = document.createElement('div');
            calcDiv.id = 'portman-calculator';
            calcDiv.innerHTML = `            
            <div class="title-and-logo">
                <div class="title">
                    Finance Calculator
                </div>
                <div class="logo">
                    <img src="` + logoImageUrl + `">
                </div>
            </div>
            `;
            document.body.appendChild(calcDiv);

            var overlay = document.createElement('div');
            overlay.id = 'portman-overlay';
            document.body.appendChild(overlay);
        }, 

        events: function() {
            let scope = this;

            var calculatorButtons = document.getElementsByClassName("portman-calculator");
            for (var i = 0; i < calculatorButtons.length; i++) {
                calculatorButtons[i].addEventListener('click', function() {
                    var itemPrice = this.getAttribute("portman-calculator-item-price");
                    var borrowingAmount = this.getAttribute("portman-calculator-borrowing-amount");
                    var minInterestRate = this.getAttribute("portman-calculator-min-interest-rate");
                    var maxInterestRate = this.getAttribute("portman-calculator-max-interest-rate");
                    var submitUrl = this.getAttribute("portman-calculator-submit-url");

                    scope.build(itemPrice, borrowingAmount, minInterestRate, maxInterestRate, submitUrl);

                    scope.showCalculator();

                } , false);
            }            
        },

        showCalculator: function() {
            var calcDiv = document.getElementById("portman-calculator");
            if (calcDiv) {
                calcDiv.classList.add("active");
            }

            var overlay = document.getElementById("portman-overlay");
            if (overlay) {
                overlay.classList.add("active");
            }
        },

        hideCalculator: function() {
            var calcDiv = document.getElementById("portman-calculator");
            if (calcDiv) {
                calcDiv.classList.remove("active");
            }

            var overlay = document.getElementById("portman-overlay");
            if (overlay) {
                overlay.classList.remove("active");
            }
        },

        dump: function() {
            console.log(this.config.borrowing_amount);
            console.log(this.config.min_interest_rate);
            console.log(this.config.max_interest_rate);
            console.log(this.config.submit_url);
            console.log(this.config.logo_image_url);
            console.log(this.config.background_colour);
            console.log(this.config.text_colour);
            console.log(this.config.accent_colour_one);
            console.log(this.config.accent_colour_two);
            console.log(this.config.utm_source);
            console.log(this.config.utm_medium);
            console.log(this.config.utm_campaign);
        }
  
    }; 
  
    window.PortmanCalculator = PortmanCalculator;
  
})(window, document);

if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
