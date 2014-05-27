/*jshint node: true*/

var fs = require("fs");
var assert = require("assert");
var hamlify = require("../index");

var templatePath = __dirname + "/hello.haml";
var exported = __dirname + "/compiled.js";

try {
  fs.unlinkSync(exported);
} catch (err) { }

fs.createReadStream(templatePath)
.pipe(hamlify(templatePath))
.pipe(fs.createWriteStream(exported))
.on("close", function() {
  var template = require(exported);
  var res = template({ msg: "hi!" });
  assert.equal(res, "<h1>hi!</h1>");
  console.log("ok");
});

