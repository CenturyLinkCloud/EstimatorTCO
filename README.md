# CenturyLink Cloud Total Cost of Ownership Estimator

A simple calculator for estimating the total cost of ownership using CetnuryLink Cloud products and services, versus other cloud providers.

A live version is hosted here: http://www.centurylinkcloud.com/tco

## Installation


The project uses Middleman for compiling a static HTML site from Ruby and uses Grunt for compiling front-end (JS and CSS). See http://middlemanapp.com/ for usage. 

- With Ruby 1.9.2+ installed, Run `bundle install` to install Ruby dependencies.
- With Node installed, run `npm install` to install Node dependencies.

## Development

- Run `middleman server` to run dev server at http://localhost:4567.
- Run `grunt dev` to watch the front-end source files and recompile as necessary.


## Build

- To compile front-end assets run `grunt`. This may be unecessary if you've been running `grunt dev`; `grunt` does the same stuff without the watching. 
- Run `middleman build` to output compiled HTML, CSS, JS to the `build` directory
- Deploy the contents of the *build* directory.


## Credits

- Designed by Nathan Young at CenturyLink Cloud / nathan.young@ctl.io
- Developed by Matt Fordham at WINTR / matt@wintr.us

## Changelog

### April, 10 2015

- Now pulls pricing data from the pricing data at '/public/prices' found in PublicPlatform
- Incorporated exchange rate switching
- Added exchange rates data file to tco calculator repo
- Added config file, '/json/data-config.json', to tco calculator repo which can be used to customize the paths to the data files used in the tco calculator
  - Paths beginning with "./" point to files relative to the tco calculator files, i.e. those in /public/static/calculator when in PublicPlatform build
  - Paths beginning with "/" point to files relative to the PublicPlatform root, i.e. "/prices/" points to the prices file the Pricing page uses.
- In order to pull the right data from the pricing sheet, a "key" has been added to products on the pricing sheet where the data is needed in the calculator, e.g. adding "server:storage:premium" to the product allows it to match up with the corresponding item in the calculator
- Updated AWS platform data
- Platform data for both Azure and AWS are now in a single file, '/json/platforms.json' and can be changed via the new config file, '/json/data-config.json'
- Added Azure platform data to the calculator
- Added Azure VM Service Tier selector and Load Balancing checkbox to engage Azure specific calculations
- Added currency to share URL
