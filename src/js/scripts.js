require('./lib/donut-chart.js');


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
            // this.dump();
        },  

        defaults: function() {
            this.defaults = {
                borrowing_amount: 90,
                min_interest_rate: 3.9,
                max_interest_rate: 9.9,
                submit_url: 'https://portmanassetfinance.co.uk',
                logo_image_url: 'https://www.portmanassetfinance.co.uk/calculator/default-logo.svg',
                accent_colour_one: '#00dcb4',
                accent_colour_two: '#4747F5',
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
            var submitUrl = submitUrl ? submitUrl : this.config.submit_url;
            
            var logoImageUrl = this.config.logo_image_url;
            var accentColour = this.config.accent_colour_one;
            var accentColourTwo = this.config.accent_colour_two;

            var utmSource = this.config.utm_source;
            var utmMedium = this.config.utm_medium;
            var utmCampaign = this.config.utm_campaign;

            var itemBorrowingAmount = itemPrice * (borrowingAmount / 100);
            var deposit = 100 - parseInt(borrowingAmount);

            var midInterestRate = (parseInt(maxInterestRate) + parseInt(minInterestRate)) / 2;

            var formattedItemPrice = this.formatCurrency(itemPrice);
            var formattedBorrowingAmount = this.formatCurrency(itemBorrowingAmount);

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
            <img src='https://portmanassetfinance.co.uk/calculator/close-icon.svg' id='portman-close-icon'>
            <div class="title-and-logo">
                <div class="title">
                    Finance Calculator
                </div>
                <div class="logo">
                    <img src="` + logoImageUrl + `">
                </div>
            </div>
            <div class="field price">
                <label for="portman_item_price">1. Item price</label>
                <input type="text" id='portman_item_price' placeholder='£' min="1000" max="1000000" inputmode="numeric" maxlength="12" value="` + formattedItemPrice + `" data-borrowing-amount="` + borrowingAmount + `" inputmode="numeric" maxlength="12">
            </div>
            <div class="field price">
                <label for="portman_borrowing_amount">2. Borrowing amount <span>(based on a ` + deposit + `% deposit)</span></label>
                <input type="text" id='portman_borrowing_amount' placeholder='£' min="1000" max="1000000" inputmode="numeric" maxlength="12" value="` + formattedBorrowingAmount + `" inputmode="numeric" maxlength="12">
            </div>
            <div class="field months">
                <label>3. For how many months?</label>
                <div class='portman-month-options'>
                    <div class='month' data-months='24'>
                        24
                        <span>months</span>
                    </div>
                    <div class='month' data-months='36'>
                        36
                        <span>months</span>
                    </div>
                    <div class='month' data-months='48'>
                        48
                        <span>months</span>
                    </div>
                    <div class='month' data-months='60'>
                        60
                        <span>months</span>
                    </div>
                    <div class='month active' data-months='72'>
                        72
                        <span>months</span>
                    </div>
                </div>
            </div>
            <div class="field credit-profile">
                <label>4. Select your credit profile</label>
                <input type="range" id="portman_credit_profile" name="portman_credit_profile" 
                min="` + minInterestRate + `" max="` + maxInterestRate + `" value="` + minInterestRate + `" step="0.1">
                <div class="credit-profile-labels">  
                    <span>Exceptional</span>
                    <span>Good</span>
                    <span>Average</span>
                    <span>Below average</span>
                    <span>Poor</span>
                </div>
            </div>
            <div class='donut-container'>
                <div id="donut-chart"></div>
                <div class='key'>
                    <div class='key-line'>
                        <div class='circle' style="background:` + accentColour + `"></div>
                        Borrowing
                    </div>
                    <div class='key-line'>
                        <div class='circle' style="background:` + accentColourTwo + `"></div>
                        Interest
                    </div>
                </div>
            </div>
            
            <div class="results">
                <div class='result-row total'>
                    <span class='label'>Total payable</span>
                    <span class='amount' id='portman_total_payable'></span>
                </div>
                <div class='result-row monthly'>
                    <span class='label'>Monthly payment</span>
                    <span class='amount' id='portman_monthly_payment'></span>
                </div>
            </div>
            <div class='tooltip'>
                <svg width="74.484" height="74.484" viewBox="29.889 26.973 14.706 14.524" xmlns="http://www.w3.org/2000/svg">
                <defs>
                <filter id="Rectangle_160" x="0" y="0" width="74.484" height="74.484" filterUnits="userSpaceOnUse">
                    <feOffset dy="3" input="SourceAlpha"/>
                    <feGaussianBlur stdDeviation="10" result="blur"/>
                    <feFlood flood-opacity="0.161"/>
                    <feComposite operator="in" in2="blur"/>
                    <feComposite in="SourceGraphic"/>
                </filter>
                </defs>
                <g id="Group_10996" data-name="Group 10996" transform="translate(-489.5 -5106)">
                <g id="Group_2244" data-name="Group 2244" transform="translate(519.5 5133)">
                    <g transform="matrix(1, 0, 0, 1, -30, -27)" filter="url(#Rectangle_160)">
                    <g id="Rectangle_160-2" data-name="Rectangle 160" transform="translate(30 27)" fill="` + accentColour + `7f" stroke="` + accentColour + `" stroke-width="0.5">
                        <rect width="14.484" height="14.484" rx="7.242" stroke="none"/>
                        <rect x="0.25" y="0.25" width="13.984" height="13.984" rx="6.992" fill="none"/>
                    </g>
                    </g>
                </g>
                <text id="_" data-name="?" transform="translate(523.542 5143.695)" font-size="11" font-weight="700" style="white-space: pre;" fill='white'><tspan x="0" y="0">?</tspan></text>
                </g>
            </svg>
                For illustration purposes only. Our experts will calculate the rate you may be offered based on your individual circumstances. This is not an offer or quote for your finance.
            </div>
            <button id='portman-submit' style="background-color:` + accentColour + `;" data-submit-url="` + submitUrl + `" data-utm-source="` + utmSource + `" data-utm-campaign="` + utmCampaign + `" data-utm-medium="` + utmMedium + `">Submit enquiry</button>
            <div class='footer'>
                <div class='top'>
                    Powered by Portman. Personal, professional finance for UK Businesses
                </div>
                <div class='bottom'>
                    Portman Finance Group includes Portman Asset Finance Limited (Reg No: 06226530) who is authorised and regulated by the Financial Conduct Authority for its credit broking activities and who deals with a panel of lenders (FRN: 719988), Portman Leasing Limited (Reg No: 06797365) authorised and regulated by the Financial Conduct for Consumer Hire lending (FRN: 723730) and Portman Commercial Finance Limited (Reg No: 10011121). The companies within Portman Finance Group are all registered in England and Wales with registered office: 1 Pavilion Court, 600 Pavilion Drive, Northampton, NN4 7SL
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
                    scope.updateDonut();

                } , false);
            }

            document.body.addEventListener("click", function (event) {

                var inputTarget = event.path[0];

                if (inputTarget.classList.contains("month") && inputTarget.parentNode.classList.contains('portman-month-options')) {
                    var monthButtons = document.querySelectorAll("#portman-calculator .portman-month-options .month");

                    for (var i = 0; i < monthButtons.length; i++) {
                        monthButtons[i].classList.remove('active');
                    }
                    
                    inputTarget.classList.add('active');

                    scope.updateDonut();
                }

                if (inputTarget.id == 'portman-overlay') {
                    scope.hideCalculator();
                }

                if (inputTarget.id == 'portman-submit') {
                    scope.submitForm(inputTarget);
                    scope.hideCalculator();
                }
                if (inputTarget.id == 'portman-close-icon') {
                    scope.hideCalculator();
                }
            });

            
            window.addEventListener('change', function (event) { 
                
                var inputTarget = event.path[0];
                if (inputTarget.id == 'portman_item_price') {
                    var borrowingAmount = inputTarget.getAttribute('data-borrowing-amount');
                    var newBorrowingAmount = inputTarget.value * (borrowingAmount / 100);
                    document.getElementById('portman_borrowing_amount').value = scope.formatCurrency(Math.floor(newBorrowingAmount));
                    scope.updateDonut();

                    inputTarget.value = scope.formatCurrency(inputTarget.value);
                }

                if (inputTarget.id == 'portman_borrowing_amount') {
                    scope.updateDonut();
                    inputTarget.value = scope.formatCurrency(inputTarget.value);
                }

                if (inputTarget.id == 'portman_credit_profile') {
                    scope.updateDonut();
                }

            })
        },        

        updateDonut: function() {
            var borrowingAmount = this.unFormatCurrency(document.getElementById('portman_borrowing_amount').value);

            if (borrowingAmount > 0) {
                var months = document.querySelectorAll("#portman-calculator .portman-month-options .month.active")[0].getAttribute('data-months');
                var interestRate = (document.getElementById('portman_credit_profile').value) / 100;
    
                var years = months / 12;
    
                var interest = 1 + (interestRate * years);
                var totalPayment = borrowingAmount * interest;
    
                var perMonthTotal = totalPayment / months;
                var perMonth = borrowingAmount / months;
                var interestPerMonth = perMonthTotal - perMonth;
    
                perMonth = perMonth.toFixed(2);
                perMonthTotal = perMonthTotal.toFixed(2);
                totalPayment = totalPayment.toFixed(2);
    
                var donutExists = document.querySelectorAll("#portman-calculator #donut-chart .inner-circle")[0];
    
                var donutData = {
                    total: perMonthTotal,
                    wedges: [
                        { id: 'a', color: this.config.accent_colour_one, value: perMonth },
                        { id: 'b', color: this.config.accent_colour_two, value: interestPerMonth },
                    ]
                };
        
                var Donut = Object.create(DonutChart);
    
                if (donutExists) {
                    Donut.update({
                        container: document.getElementById('donut-chart'),
                        data: donutData
                    });
                }
                else {        
                    Donut.init({
                        container: document.getElementById('donut-chart'),
                        data: donutData
                    });
                }
                
                document.getElementById('portman_total_payable').innerHTML = this.formatCurrency(totalPayment);
                document.getElementById('portman_monthly_payment').innerHTML = this.formatCurrency(perMonthTotal);
            }
        },

        submitForm: function(submitButton) {
            var submitUrl = submitButton.getAttribute("data-submit-url");
            var utmSource = submitButton.getAttribute("data-utm-source");
            var utmMedium = submitButton.getAttribute("data-utm-medium");
            var utmCampaign = submitButton.getAttribute("data-utm-campaign");
            var amount = this.unFormatCurrency(document.getElementById('portman_borrowing_amount').value);

            if (submitUrl && utmSource && utmMedium && utmCampaign) {
                var redirectUrl = submitUrl + '?utm-source=' + utmSource + '&utm-medium=' + utmMedium + '&utm-campaign=' + utmCampaign + '&amount=' + amount;
                window.location = redirectUrl;
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

        formatCurrency: function(number) {
            number = parseFloat(number) || "0";
            if (number) {
                try {
                    return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'GBP' }).format(number);
                }
                catch (ex) {
                    return '';
                }
                
            }
            
        },

        unFormatCurrency: function(value) {
            if (value) {
                var justNumbers = value.toString().replace(/[,£]/g, "");
                if (justNumbers) {
                    return parseFloat(justNumbers) || 0;;
                }
                else {
                    return '';
                }
            }
            else {
                return '';
            }
        },

        dump: function() {
            console.log(this.config.borrowing_amount);
            console.log(this.config.min_interest_rate);
            console.log(this.config.max_interest_rate);
            console.log(this.config.submit_url);
            console.log(this.config.logo_image_url);
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
