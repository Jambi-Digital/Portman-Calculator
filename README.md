# Portman-Calculator

This library allows websites to easily embed the Portman Asset Finance calculator on their own site.

# Installation

To get started your website will need to reference the JavaScript file CSS listed here: 

https://cdn.jsdelivr.net/gh/Jambi-Digital/Portman-Calculator@main/dist/portman-calculator.min.js
https://cdn.jsdelivr.net/gh/Jambi-Digital/Portman-Calculator@main/dist/portman-calculator.min.css

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

| Field ID            | Explaination                                                                                                                                    | Default                                                           | Expected input            | Overridable |   |   |   |   |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|---------------------------|-------------|---|---|---|---|
| borrowing_amount    | This is the default borrowing amount as a percentage shown on the calculator                                                                    | 90                                                                | Integer between 0 and 100 | Yes         |   |   |   |   |
| min_interest_amount | The minimum interest rate                                                                                                                       | 3.9                                                               | Decimal                   | Yes         |   |   |   |   |
| max_interest_rate   | The maximum interest rate                                                                                                                       | 9.9                                                               | Decimal                   | Yes         |   |   |   |   |
| submit_url          | This is the page that loads up once the calculator is submitted. Portman Asset Finance may request you change this to a particular landing page | https://portmanassetfinance.com#form                              | String                    | Yes         |   |   |   |   |
| logo_url            | The source path of the logo that is shown at the top of the calculator                                                                          | https://www.portmanassetfinance.co.uk/calculator/default-logo.svg | String                    | Yes         |   |   |   |   |
| background_colour   | The background colour of the calculator                                                                                                         | #0e212f                                                           | HEX code                  | No          |   |   |   |   |
| text_colour         | The colour of text on the calculator                                                                                                            | #ffffff                                                           | HEX code                  | No          |   |   |   |   |
| accent_colour_one   | First accent colour                                                                                                                             | #00dcb4                                                           | HEX code                  | No          |   |   |   |   |
| accent_colour_two   | Second accent colour                                                                                                                            | #184363                                                           | HEX code                  | No          |   |   |   |   |
| utm_source          | UTM source field                                                                                                                                | None - required field                                             | String                    | No          |   |   |   |   |
| utm_medium          | UTM medium field                                                                                                                                | None - required field                                             | String                    | No          |   |   |   |   |
| utm_campaign        | UTM campaign field                                                                                                                              | None - required field                                             | String                    | No          |   |   |   |   |
