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

        getMonthlyRate: function(itemPrice, numberOfMonths, format=false) {
            if (itemPrice > 0) {
                var interestRate = this.config.min_rate / 100;
    
                var years = numberOfMonths / 12;
    
                var interest = 1 + (interestRate * years);
                var totalPayment = itemPrice * interest;
    
                var perMonthTotal = totalPayment / numberOfMonths;
                
                if (format) {
                    return this.formatCurrency(perMonthTotal);
                }
                else {
                    return perMonthTotal;
                }
                
            }
        },

        defaults: function() {
            this.defaults = {
                borrowing_amount: 90,
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
                    submit_url: options.submit_url ? options.submit_url : this.defaults.submit_url,
                    logo_image_url: options.logo_image_url ? options.logo_image_url : this.defaults.logo_image_url,
                    accent_colour_one: options.accent_colour_one ? options.accent_colour_one : this.defaults.accent_colour_one,
                    accent_colour_two: options.accent_colour_two ? options.accent_colour_two : this.defaults.accent_colour_two,
                    utm_source: options.utm_source ? options.utm_source : this.config.utm_source,
                    utm_medium: options.utm_medium ? options.utm_medium : this.config.utm_medium,
                    utm_campaign: options.utm_campaign ? options.utm_campaign : this.config.utm_campaign,
                    min_rate: 3.9,
                    max_rate: 14.9,
                    // parent_window: window.parent.document ? window.parent.document : document
                    parent_window: document
                };
            }
            else {
                throw 'The utm_source, utm_medium, and utm_campaign fields are all required when using the Portman Calculator. Please specify these fields in the object parameter of the init() function';
            }
            
    
        },

        build: function(itemPrice = false, borrowingAmount = false, submitUrl = false, itemName = false) {      
            var itemPrice = itemPrice ? itemPrice : '';
            var borrowingAmount = borrowingAmount ? borrowingAmount : this.config.borrowing_amount;
            var submitUrl = submitUrl ? submitUrl : this.config.submit_url;
            
            var logoImageUrl = this.config.logo_image_url;
            var accentColour = this.config.accent_colour_one;
            var accentColourTwo = this.config.accent_colour_two;

            var utmSource = this.config.utm_source;
            var utmMedium = this.config.utm_medium;
            var utmCampaign = this.config.utm_campaign;

            var minRate = this.config.min_rate;
            var maxRate = this.config.max_rate;

            var itemBorrowingAmount = itemPrice * (borrowingAmount / 100);
            var deposit = 100 - parseInt(borrowingAmount);

            var formattedItemPrice = this.formatCurrency(itemPrice);
            var formattedBorrowingAmount = this.formatCurrency(itemBorrowingAmount);

            var calcDiv = this.config.parent_window.getElementById("portman-calculator");
            if (calcDiv) {
                calcDiv.remove();
            }

            var overlay = this.config.parent_window.getElementById("portman-overlay");
            if (overlay) {
                overlay.remove();
            }

            
            var calcDiv = this.config.parent_window.createElement('div');
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
                min="` + minRate + `" max="` + maxRate + `" value="` + minRate + `" step="0.1">
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
            <button id='portman-submit' style="background-color:` + accentColour + `;" data-submit-url="` + submitUrl + `" data-utm-source="` + utmSource + `" data-utm-campaign="` + utmCampaign + `" data-utm-medium="` + utmMedium + `" data-item-name="` + itemName + `">Get a Quote</button>
            <div class='footer'>
                <div class='top'>
                    Powered by <img src='https://www.portmanassetfinance.co.uk/calculator/default-logo.svg' alt='Portman'> Personal, professional finance for UK Businesses
                </div>
                <div class='bottom'>
                    Portman Finance Group includes Portman Asset Finance Limited (Reg No: 06226530) who is authorised and regulated by the Financial Conduct Authority for its credit broking activities and who deals with a panel of lenders (FRN: 719988), Portman Leasing Limited (Reg No: 06797365) authorised and regulated by the Financial Conduct for Consumer Hire lending (FRN: 723730) and Portman Commercial Finance Limited (Reg No: 10011121). The companies within Portman Finance Group are all registered in England and Wales with registered office: 1 Pavilion Court, 600 Pavilion Drive, Northampton, NN4 7SL
                </div>
            </div>
        
            `;
            
            this.config.parent_window.body.appendChild(calcDiv);

            var overlay = this.config.parent_window.createElement('div');
            overlay.id = 'portman-overlay';
            this.config.parent_window.body.appendChild(overlay);
        }, 

        events: function() {
            let scope = this;
            setTimeout(() => {
                var allButtons = [];
                allButtons = Array.prototype.concat.apply(allButtons, this.config.parent_window.getElementsByClassName("portman-calculator"));
                allButtons = Array.prototype.concat.apply(allButtons, document.body.getElementsByClassName("portman-calculator"));

                for (var i = 0; i < allButtons.length; i++) {
                    allButtons[i].addEventListener('click', function() {
                        var itemPrice = this.getAttribute("portman-calculator-item-price");
                        var itemName = this.getAttribute("portman-calculator-item-name");
                        var borrowingAmount = this.getAttribute("portman-calculator-borrowing-amount");
                        var submitUrl = this.getAttribute("portman-calculator-submit-url");

                        scope.build(itemPrice, borrowingAmount, submitUrl, itemName);

                        scope.showCalculator();
                        scope.updateDonut();

                    } , false);
                }
            }, 2000);
            

            this.config.parent_window.addEventListener("click", function (event) {
                if (event.path) {
                    var inputTarget = event.path[0];
                }
                else {
                    var inputTarget = event.target;
                }
                


                if (inputTarget.classList.contains("month") && inputTarget.parentNode.classList.contains('portman-month-options')) {
                    var monthButtons = scope.config.parent_window.querySelectorAll("#portman-calculator .portman-month-options .month");

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

            
            this.config.parent_window.addEventListener('change', function (event) { 
                
                if (event.path) {
                    var inputTarget = event.path[0];
                }
                else {
                    var inputTarget = event.target;
                }
                if (inputTarget.id == 'portman_item_price') {
                    var borrowingAmount = inputTarget.getAttribute('data-borrowing-amount');
                    var newBorrowingAmount = inputTarget.value * (borrowingAmount / 100);
                    this.config.parent_window.getElementById('portman_borrowing_amount').value = scope.formatCurrency(Math.floor(newBorrowingAmount));
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
            var borrowingAmount = this.unFormatCurrency(this.config.parent_window.getElementById('portman_borrowing_amount').value);

            if (borrowingAmount > 0) {
                var months = this.config.parent_window.querySelectorAll("#portman-calculator .portman-month-options .month.active")[0].getAttribute('data-months');
                var interestRate = (this.config.parent_window.getElementById('portman_credit_profile').value) / 100;
    
                var years = months / 12;
    
                var interest = 1 + (interestRate * years);
                var totalPayment = borrowingAmount * interest;
    
                var perMonthTotal = totalPayment / months;
                var perMonth = borrowingAmount / months;
                var interestPerMonth = perMonthTotal - perMonth;
    
                perMonth = perMonth.toFixed(2);
                perMonthTotal = perMonthTotal.toFixed(2);
                totalPayment = totalPayment.toFixed(2);
    
                var donutExists = this.config.parent_window.querySelectorAll("#portman-calculator #donut-chart .inner-circle")[0];
    
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
                        container: this.config.parent_window.getElementById('donut-chart'),
                        data: donutData
                    });
                }
                else {        
                    Donut.init({
                        container: this.config.parent_window.getElementById('donut-chart'),
                        data: donutData
                    });
                }
                
                this.config.parent_window.getElementById('portman_total_payable').innerHTML = this.formatCurrency(totalPayment);
                this.config.parent_window.getElementById('portman_monthly_payment').innerHTML = this.formatCurrency(perMonthTotal);
            }
        },

        submitForm: function(submitButton) {
            var submitUrl = submitButton.getAttribute("data-submit-url");
            var utmSource = submitButton.getAttribute("data-utm-source");
            var utmMedium = submitButton.getAttribute("data-utm-medium");
            var utmCampaign = submitButton.getAttribute("data-utm-campaign");
            var itemName = submitButton.getAttribute("data-item-name");
            var amount = this.unFormatCurrency(this.config.parent_window.getElementById('portman_item_price').value);

            if (submitUrl && utmSource && utmMedium && utmCampaign) {
                var redirectUrl = submitUrl + '?utm_source=' + utmSource + '&utm_medium=' + utmMedium + '&utm_campaign=' + utmCampaign + '&amount=' + amount + '&item_name=' + itemName;
                this.config.parent_window.location = redirectUrl;
            }

        },

        showCalculator: function() {
            var calcDiv = this.config.parent_window.getElementById("portman-calculator");
            if (calcDiv) {
                calcDiv.classList.add("active");
            }

            var overlay = this.config.parent_window.getElementById("portman-overlay");
            if (overlay) {
                overlay.classList.add("active");
            }
        },

        hideCalculator: function() {
            var calcDiv = this.config.parent_window.getElementById("portman-calculator");
            if (calcDiv) {
                calcDiv.classList.remove("active");
            }

            var overlay = this.config.parent_window.getElementById("portman-overlay");
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
