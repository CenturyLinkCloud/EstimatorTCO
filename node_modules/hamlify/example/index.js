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
