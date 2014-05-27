[![Build Status](https://travis-ci.org/trxcllnt/node-hamlify.png?branch=master)](https://travis-ci.org/trxcllnt/node-hamlify)

# hamlify

[Haml-coffee][] precompiler plugin for [Browserify v2][] without magic.

Compiles Haml templates to plain Javascript.

## Usage

Install hamlify locally to your project:

    npm install hamlify

Then use it as Browserify transform module with `-t`:

    browserify -t hamlify main.js > bundle.js

where main.js can be like:

```javascript
var template = require("./template.haml");
document.body.innerHTML = template({ name: "Epeli" });
```

and template.haml:

```html
%h1= @name!
```

Checkout the example folder for details.

## Browserify?

<https://github.com/substack/node-browserify>

Further reading: <http://esa-matti.suuronen.org/blog/2013/03/22/journey-from-requirejs-to-browserify/>

[Haml-coffee]: https://github.com/netzpirat/haml-coffee
[Browserify v2]: https://github.com/substack/node-browserify
