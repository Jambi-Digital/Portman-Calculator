# Portman-Calculator

This library allows websites to easily embed the Portman Asset Finance calculator on their own site.

# Installation

To get started your website will need to reference the JavaScript file CSS listed here: 

    <link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/Jambi-Digital/Portman-Calculator@main/dist/portman-calculator.min.css'>
    <script type='text/javascript' src='https://cdn.jsdelivr.net/gh/Jambi-Digital/Portman-Calculator@main/dist/portman-calculator.min.js' async='async'></script>

There are no other dependencies at this time

# Getting Started

## Step One - init()

Once the JavaScript and CSS files are embedded you'll need to run this code: 
                
    var calc = Object.create(PortmanCalculator);
    calc.init({
        utm_source: 'Your UTM Source value',
        utm_medium: 'Your UTM Medium value',
        utm_campaign: 'Your UTM Campaign value',
    });

This should be done after all the script files are loaded, for example in the $(document).ready() function if using jQuery

## Step Two - options

The init() function expects an options array. There are only three required options: utm_source, utm_medium, and utm_campaign. Please speak to Portman if you're unsure what these values should be

An error will be thrown if those three fields are not present. 

There are also other options available, listed here: 

| Field ID            | Explaination                                                                                                                                    | Default                                                           | Expected input            | Overridable |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|---------------------------|-------------|
| borrowing_amount    | This is the default borrowing amount as a percentage shown on the calculator                                                                    | 90                                                                | Integer between 0 and 100 | Yes         |
| min_interest_amount | The minimum interest rate                                                                                                                       | 3.9                                                               | Decimal                   | Yes         |
| max_interest_rate   | The maximum interest rate                                                                                                                       | 9.9                                                               | Decimal                   | Yes         |
| submit_url          | This is the page that loads up once the calculator is submitted. Portman Asset Finance may request you change this to a particular landing page | https://portmanassetfinance.com#form                              | String                    | Yes         |
| logo_url            | The source path of the logo that is shown at the top of the calculator                                                                          | https://www.portmanassetfinance.co.uk/calculator/default-logo.svg | String                    | No         |
| background_colour   | The background colour of the calculator                                                                                                         | #0e212f                                                           | HEX code                  | No          |
| text_colour         | The colour of text on the calculator                                                                                                            | #ffffff                                                           | HEX code                  | No          |
| accent_colour_one   | First accent colour                                                                                                                             | #00dcb4                                                           | HEX code                  | No          |
| accent_colour_two   | Second accent colour                                                                                                                            | #184363                                                           | HEX code                  | No          |
| utm_source          | UTM source field                                                                                                                                | None - required field                                             | String                    | No          |
| utm_medium          | UTM medium field                                                                                                                                | None - required field                                             | String                    | No          |
| utm_campaign        | UTM campaign field                                                                                                                              | None - required field                                             | String                    | No          |

Here's an example of the init() function showing all available options: 

    calc.init({
        utm_source: 'Your UTM Source value',
        utm_medium: 'Your UTM Medium value',
        utm_campaign: 'Your UTM Campaign value',
        borrowing_amount: 90,
        min_interest_rate: 3.9,
        max_interest_rate: 9.9,
        submit_url: 'https://portmanassetfinance.com#form',
        logo_image_url: 'https://www.portmanassetfinance.co.uk/calculator/default-logo.svg',
        background_colour: '#0e212f',
        text_colour: '#ffffff',
        accent_colour_one: '#00dcb4',
        accent_colour_two: '#184363',
    });

## Step three - hooking the calculator to a button

Once the calculator is initialised we'll need to decorate the buttons we want to show the calculator when clicked with a bit of code. 

The button needs to have the class 'portman-calculator' and have an attribute named 'portman-calculator-item-price'. Here's an example: 

    <button class="portman-calculator" portman-calculator-item-price='{{ $itemPrice }}' >View financing options</button>

The item-price needs to be injected into the HTML markup as an integer, not a string. So '100000' rather than '£100,000'. 

If this button is clicked the calculator will popup with the item price specified. 

## Step four - overriding global options

It is also possible to override some of the global options on a per-button basis. This may be useful if some options pertained to some products but not others. For example, if most products listed on the website required a 10% deposit, the global borrowing_amount field could be set at 90. However if some products needed a 25% deposit, we could alter the borrowing amount for that product, like this: 

    <button class="button portman-calculator" portman-calculator-item-price='{{ $itemPrice }}' portman-calculator-borrowing-amount='75' >View financing options</button>
    
All the options labelled as overridable in Step 2 can be overridden in this way. Here's an example that overrides every global setting:

    <button class="portman-calculator" 
      portman-calculator-item-price='{{ $itemPrice }}' 
      portman-calculator-borrowing-amount='75'
      portman-calculator-min-interest-rate='4.5' 
      portman-calculator-max-interest-rate='12.5' 
      portman-calculator-submit-url='https://portmanassetfinance.co.uk/your-landing-page#form' >
        View financing options
    </button>