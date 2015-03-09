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
