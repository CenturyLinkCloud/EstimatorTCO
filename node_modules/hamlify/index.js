/*jshint node: true*/

var through = require('through');
var CoffeeScript = require('coffee-script');
var Compiler = require('./node_modules/haml-coffee/src/haml-coffee')

module.exports = function(file) {
  if (!/\.haml|\.hamlc/.test(file)) return through();

  var source = "";

  return through(function(chunk) {
    source += chunk.toString();
  },
  function() {
    
    var compiler = new Compiler({});
    compiler.parse(source);
    var template = CoffeeScript.compile(compiler.precompile(), {bare: true});
    var compiled = "module.exports = function(options) {\nreturn (function() {\n" +
      template +
      "\n}).call(options)\n};";
    
    this.queue(compiled);
    this.queue(null);
  });
};
