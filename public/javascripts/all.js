(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = _.extend({}, Backbone.Events);


},{}],2:[function(require,module,exports){
var SettingsModel;

SettingsModel = Backbone.Model.extend({
  defaults: {
    platform: "aws",
    quantity: 1,
    os: "linux",
    storage: 100,
    bandwidth: 10,
    snapshots: 1,
    matchCPU: false,
    matchIOPS: false,
    iops: 0,
    additionalFeatures: []
  },
  initialize: function() {}
});

module.exports = SettingsModel;


},{}],3:[function(require,module,exports){
var InputPanelView, PubSub, SettingsModel;

PubSub = require('../PubSub.coffee');

SettingsModel = require('../models/SettingsModel.coffee');

InputPanelView = Backbone.View.extend({
  el: "#input-panel",
  events: {
    "change .platform-select": "onPlatformChanged",
    "keypress .number": "ensureNumber",
    "change select[name]": "onFormChanged",
    "change input[name]": "onFormChanged",
    "input input[name]": "onFormChanged",
    "keyup input[name]": "onFormChanged"
  },
  initialize: function(options) {},
  onPlatformChanged: function() {
    var data;
    PubSub.trigger("inputPanel:change");
    return data = Backbone.Syphon.serialize(this);
  },
  onFormChanged: function() {
    var data;
    data = Backbone.Syphon.serialize(this);
    return this.model.set(data);
  },
  ensureNumber: function(e) {
    var charCode;
    charCode = (e.which ? e.which : e.keyCode);
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
});

module.exports = InputPanelView;


},{"../PubSub.coffee":1,"../models/SettingsModel.coffee":2}],4:[function(require,module,exports){
var PlatformProductsView, PubSub;

PubSub = require('../PubSub.coffee');

PlatformProductsView = Backbone.View.extend({
  el: "#platform-products-table",
  initialize: function(options) {
    return console.log("platform");
  }
});

module.exports = PlatformProductsView;


},{"../PubSub.coffee":1}],5:[function(require,module,exports){
var App, InputPanelView, PlatformProductsView, PubSub, SettingsModel;

PubSub = require('./app/PubSub.coffee');

InputPanelView = require('./app/views/InputPanelView.coffee');

PlatformProductsView = require('./app/views/PlatformProductsView.coffee');

SettingsModel = require('./app/models/SettingsModel.coffee');

App = {
  init: function() {
    _.extend(this, Backbone.Events);
    this.settingsModel = new SettingsModel();
    this.inputPanelView = new InputPanelView({
      model: this.settingsModel
    });
    this.platformProductsView = new PlatformProductsView();
    return this.initGlobalEvents();
  },
  initGlobalEvents: function() {
    return PubSub.on("inputPanel:change", this.onInputPanelChange);
  },
  onInputPanelChange: function(e) {
    return console.log("on input panel change");
  }
};

$(function() {
  return App.init();
});


},{"./app/PubSub.coffee":1,"./app/models/SettingsModel.coffee":2,"./app/views/InputPanelView.coffee":3,"./app/views/PlatformProductsView.coffee":4}]},{},[5])