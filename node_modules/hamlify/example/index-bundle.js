%a(href= @url)= @name

%div
	%h1 Hello, I'm @name
	%p My links are:
	%ul
	- for link in @links
		%li != require('./partial.haml')(link)
;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var partial = require("./partial.haml");
var template = require("./template.haml");

var data = {
  name: "paul",
  links: [
    { name: "Blog", url: "http://trxcllnt.com/" },
    { name: "Twitter", url: "https://twitter.com/trxcllnt" },
    { name: "Github", url: "https://github.com/trxcllnt" }
  ]
};

window.onload = function() {
  document.body.innerHTML = template(data);
};

},{"./partial.haml":2,"./template.haml":3}],2:[function(require,module,exports){
module.exports = function(options) {
return (function() {
var $c, $e, $o;

$e = function(text, escape) {
  return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
};

$c = function(text) {
  switch (text) {
    case null:
    case void 0:
      return '';
    case true:
    case false:
      return '' + text;
    default:
      return text;
  }
};

$o = [];

$o.push("<a href='" + ($e($c(this.url))) + "'>" + ($e($c(this.name))) + "</a>");

return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');

}).call(options)
};
},{}],3:[function(require,module,exports){
module.exports = function(options) {
return (function() {
var $c, $o, link, _i, _len, _ref;

$c = function(text) {
  switch (text) {
    case null:
    case void 0:
      return '';
    case true:
    case false:
      return '' + text;
    default:
      return text;
  }
};

$o = [];

$o.push("<div>\n  <h1>Hello, I'm @name</h1>\n  <p>My links are:</p>\n  <ul></ul>");

_ref = this.links;
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  link = _ref[_i];
  $o.push("  <li>" + ($c(require('./partial.haml')(link))) + "</li>");
}

$o.push("</div>");

return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');

}).call(options)
};
},{"./partial.haml":2}]},{},[1])
;