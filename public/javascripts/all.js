(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Config;

Config = {
  NAME: "matt",
  CLC_PRICING_URL_ROOT: "/prices/"
};

module.exports = Config;


},{}],2:[function(require,module,exports){
module.exports = _.extend({}, Backbone.Events);


},{}],3:[function(require,module,exports){
var PubSub, Router;

PubSub = require("./PubSub.coffee");

Router = Backbone.Router.extend({
  routes: {
    "input/:data": "input"
  },
  input: function(data) {
    return PubSub.trigger("url:change", JSON.parse(data));
  }
});

module.exports = Router;


},{"./PubSub.coffee":2}],4:[function(require,module,exports){
var DEFAULT, PlatformCollection, PlatformModel;

PlatformModel = require('../models/PlatformModel.coffee');

DEFAULT = require('../data/platforms.coffee');

PlatformCollection = Backbone.Collection.extend({
  model: PlatformModel,
  url: "json/platforms.json",
  initialize: function() {
    return this.fetch();
  },
  forKey: function(type) {
    return _.first(this.where({
      "type": type
    }));
  }
});

module.exports = PlatformCollection;


},{"../data/platforms.coffee":7,"../models/PlatformModel.coffee":9}],5:[function(require,module,exports){
var ProductCollection, ProductModel;

ProductModel = require('../models/ProductModel.coffee');

ProductCollection = Backbone.Collection.extend({
  model: ProductModel,
  initialize: function() {}
});

module.exports = ProductCollection;


},{"../models/ProductModel.coffee":10}],6:[function(require,module,exports){
module.exports = {
  "iops": 611.74
};


},{}],7:[function(require,module,exports){
module.exports = [
  {
    "key": "aws",
    "name": "AWS",
    "pricing": {
      "standardPerGB": 0.05,
      "perMillionRequests": 0.05,
      "provisionedPerGB": 0.125,
      "provisionedIOPSPerMonth": 0.10,
      "firstSnapshot": 0.7,
      "remainingSnapshotsEach": 0.03,
      "snapshotPerGB": 0.095,
      "bandwidthOutbound": 0.1
    },
    "benchmarking": {
      "cpu": 1.524886878,
      "ram": 0.992
    },
    "additionalFeatures": [
      {
        "key": "mcm",
        "name": "Cloud Manager",
        "pricing": 0.02
      }, {
        "key": "rightScale",
        "name": "RightScale",
        "pricing": 0.08
      }, {
        "key": "alertLogic",
        "name": "AlertLogic",
        "pricing": 0.58
      }
    ],
    "products": [
      {
        "name": "r3.large",
        "cpu": 2,
        "ram": 15,
        "price": 0.175,
        "windows": 0.125,
        "redhat": 0.060,
        "rightScaleRCU": 2
      }, {
        "name": "r3.xlarge",
        "cpu": 4,
        "ram": 30.5,
        "price": 0.350,
        "windows": 0.250,
        "redhat": 0.060,
        "rightScaleRCU": 4
      }, {
        "name": "r3.2 Xlarge",
        "cpu": 8,
        "ram": 61,
        "price": 0.7,
        "windows": 0.380,
        "redhat": 0.130,
        "rightScaleRCU": 8
      }, {
        "name": "r3.4 Xlarge",
        "cpu": 16,
        "ram": 122,
        "price": 1.4,
        "windows": 0.544,
        "redhat": 0.130,
        "rightScaleRCU": 16
      }, {
        "name": "r3.8 Xlarge",
        "cpu": 32,
        "ram": 244,
        "price": 2.8,
        "windows": 0.700,
        "redhat": 0.130,
        "rightScaleRCU": 16
      }, {
        "name": "m3.medium",
        "cpu": 1,
        "ram": 3.7,
        "price": 0.07,
        "windows": 0.063,
        "redhat": 0.060,
        "rightScaleRCU": 1
      }, {
        "name": "m3.large",
        "cpu": 2,
        "ram": 7.5,
        "price": 0.14,
        "windows": 0.126,
        "redhat": 0.060,
        "rightScaleRCU": 2
      }, {
        "name": "m3.xlarge",
        "cpu": 4,
        "ram": 15,
        "price": 0.28,
        "windows": 0.252,
        "redhat": 0.060,
        "rightScaleRCU": 4
      }, {
        "name": "m3.2xlarge",
        "cpu": 8,
        "ram": 30,
        "price": 0.56,
        "windows": 0.504,
        "redhat": 0.130,
        "rightScaleRCU": 8
      }, {
        "name": "c3.large",
        "cpu": 2,
        "ram": 3.7,
        "price": 0.105,
        "windows": 0.083,
        "redhat": 0.060,
        "rightScaleRCU": 1
      }, {
        "name": "c3.xlarge",
        "cpu": 4,
        "ram": 7,
        "price": 0.21,
        "windows": 0.166,
        "redhat": 0.060,
        "rightScaleRCU": 2
      }, {
        "name": "c3.2xlarge",
        "cpu": 8,
        "ram": 15,
        "price": 0.42,
        "windows": 0.332,
        "redhat": 0.130,
        "rightScaleRCU": 4
      }, {
        "name": "c3.4xlarge",
        "cpu": 16,
        "ram": 30,
        "price": 0.84,
        "windows": 0.664,
        "redhat": 0.130,
        "rightScaleRCU": 8
      }, {
        "name": "c3.8xlarge",
        "cpu": 32,
        "ram": 60,
        "price": 1.680,
        "windows": 1.328,
        "redhat": 0.130,
        "rightScaleRCU": 16
      }
    ]
  }
];


},{}],8:[function(require,module,exports){
module.exports = {
  "cpu": 0.01,
  "ram": 0.015,
  "standardStorage": 0.000205338809034907,
  "premiumStorage": 0.000547945,
  "bandwidth": 0.05,
  "windows": 0.04,
  "redhat": 0.04,
  "linux": 0
};


},{}],9:[function(require,module,exports){
var PlatformModel;

PlatformModel = Backbone.Model.extend({
  initialize: function() {}
});

module.exports = PlatformModel;


},{}],10:[function(require,module,exports){
var ProductModel;

ProductModel = Backbone.Model.extend({
  HOURS_PER_MONTH: 730,
  initialize: function() {
    this.settings = App.settingsModel;
    this.platformBenchmarking = App.platform.get("benchmarking");
    this.platformPricing = App.platform.get("pricing");
    return this.platformAdditionalFeatures = App.platform.get("additionalFeatures");
  },
  platformBandwidthPrice: function() {
    return this.settings.get("bandwidth") * this.platformPricing.bandwidthOutbound / this.HOURS_PER_MONTH;
  },
  platformStoragePrice: function() {
    return this.settings.get("storage") * this.platformPricing.standardPerGB / this.HOURS_PER_MONTH;
  },
  platformStorageIORequests: function() {
    return 5 * this.platformPricing.perMillionRequests / this.HOURS_PER_MONTH;
  },
  platformSnapshotCapacityUtilized: function() {
    var storage;
    if (this.settings.get("iops") > 0) {
      storage = 215;
    } else {
      storage = this.settings.get("storage");
    }
    return (storage * this.platformPricing.firstSnapshot) + (this.settings.get("snapshots") - 1) * this.platformPricing.remainingSnapshotsEach * storage;
  },
  platformSnapshotPrice: function() {
    return (this.platformSnapshotCapacityUtilized() * this.platformPricing.snapshotPerGB) / this.HOURS_PER_MONTH;
  },
  platformIOPSPrice: function() {
    var ebs, iops;
    iops = (this.settings.get("iops") * this.platformPricing.provisionedIOPSPerMonth) / this.HOURS_PER_MONTH;
    ebs = (215 * this.platformPricing.provisionedPerGB) / this.HOURS_PER_MONTH;
    if (this.settings.get("iops") > 0) {
      console.log(iops, ebs);
      return iops + ebs;
    } else {
      return 0;
    }
  },
  platformOSPrice: function() {
    if (this.settings.get("os") === "linux") {
      return 0;
    } else {
      return this.get(this.settings.get("os"));
    }
  },
  platformTotalPrice: function() {
    var perRCU, subtotal, total;
    if (this.settings.get("iops") > 0) {
      subtotal = (this.get("price") + this.platformBandwidthPrice() + this.platformIOPSPrice() + this.platformSnapshotPrice() + this.platformOSPrice()) * this.settings.get("quantity");
    } else {
      subtotal = (this.get("price") + this.platformBandwidthPrice() + this.platformIOPSPrice() + this.platformStoragePrice() + this.platformSnapshotPrice() + this.platformStorageIORequests() + this.platformOSPrice()) * this.settings.get("quantity");
    }
    total = subtotal;
    if (App.platform.get("key") === "aws") {
      if (this.settings.get("mcm")) {
        total += _.findWhere(this.platformAdditionalFeatures, {
          "key": "mcm"
        }).pricing;
      }
      if (this.settings.get("alertLogic")) {
        total += _.findWhere(this.platformAdditionalFeatures, {
          "key": "alertLogic"
        }).pricing;
      }
      if (this.settings.get("rightScale")) {
        perRCU = _.findWhere(this.platformAdditionalFeatures, {
          "key": "rightScale"
        }).pricing;
        total += this.get("rightScaleRCU") * perRCU;
      }
    }
    return total;
  },
  clcEquivalentRam: function() {
    if (this.settings.get("matchCPU")) {
      return Math.ceil(this.get("ram") / this.platformBenchmarking.ram);
    } else {
      return this.get("ram");
    }
  },
  clcEquivalentCpu: function() {
    if (this.settings.get("matchCPU")) {
      return Math.ceil(this.get("cpu") / this.platformBenchmarking.cpu);
    } else {
      return this.get("cpu");
    }
  },
  clcRamPrice: function() {
    return this.clcEquivalentRam() * App.clcPricing.ram;
  },
  clcCpuPrice: function() {
    return this.clcEquivalentCpu() * App.clcPricing.cpu;
  },
  clcDiskPrice: function() {
    var price;
    if (parseInt(this.settings.get("snapshots")) === 5) {
      price = this.settings.get("storage") * App.clcPricing.standardStorage;
    } else if (parseInt(this.settings.get("snapshots")) === 14) {
      price = this.settings.get("storage") * App.clcPricing.premiumStorage;
    }
    return price;
  },
  clcBandwidthPrice: function() {
    return this.settings.get("bandwidth") * App.clcPricing.bandwidth / this.HOURS_PER_MONTH;
  },
  clcOSPrice: function() {
    return App.clcPricing[this.settings.get("os")] * this.clcEquivalentCpu();
  },
  clcTotalPrice: function() {
    return (this.clcRamPrice() + this.clcCpuPrice() + this.clcDiskPrice() + this.clcBandwidthPrice() + this.clcOSPrice()) * this.settings.get("quantity");
  },
  variance: function() {
    return this.platformTotalPrice() - this.clcTotalPrice();
  },
  savings: function() {
    if (this.settings.get("quantity") > 0) {
      return Math.round((1 - this.clcTotalPrice() / this.platformTotalPrice()) * 100);
    } else {
      return 0;
    }
  }
});

module.exports = ProductModel;


},{}],11:[function(require,module,exports){
var SettingsModel;

SettingsModel = Backbone.Model.extend({
  defaults: {
    platform: "aws",
    quantity: 1,
    os: "linux",
    storage: 100,
    bandwidth: 1000,
    snapshots: 5,
    matchCPU: false,
    matchIOPS: false,
    iops: 0,
    additionalFeatures: []
  },
  initialize: function() {}
});

module.exports = SettingsModel;


},{}],12:[function(require,module,exports){
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

$o.push("<label for='" + ($e($c(this.model.key))) + "'>\n  <input id='" + ($e($c(this.model.key))) + "' name='" + ($e($c(this.model.key))) + "' type='checkbox'>");

$o.push("  " + $e($c(this.model.name)));

$o.push("</label>");

return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");

}).call(options)
};
},{}],13:[function(require,module,exports){
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

$o.push("<td>" + ($e($c(this.model.clcEquivalentCpu()))) + "</td>\n<td>" + ($e($c(this.model.clcEquivalentRam()))) + "</td>\n<td>" + ($e($c(accounting.formatMoney(this.model.clcTotalPrice(), {
  precision: 3
})))) + "</td>");

return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');

}).call(options)
};
},{}],14:[function(require,module,exports){
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

$o.push("<td class='left-align'>" + ($e($c(this.model.get("name")))) + "</td>\n<td>" + ($e($c(this.model.get("cpu")))) + "</td>\n<td>" + ($e($c(this.model.get("ram")))) + "</td>\n<td>" + ($e($c(accounting.formatMoney(this.model.platformTotalPrice(), {
  precision: 3
})))) + "</td>");

return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");

}).call(options)
};
},{}],15:[function(require,module,exports){
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

$o.push("<td>" + ($e($c(accounting.formatMoney(this.model.variance(), {
  precision: 3
})))) + "</td>\n<td>" + ($e($c(accounting.formatMoney(this.model.variance() * 8765.81, {
  precision: 2
})))) + "</td>\n<td>" + ($e($c("" + (this.model.savings()) + "%"))) + "</td>");

return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');

}).call(options)
};
},{}],16:[function(require,module,exports){
var AdditionalFeatureView;

AdditionalFeatureView = Backbone.View.extend({
  tagName: "span",
  className: "additional-feature",
  initialize: function(options) {},
  render: function() {
    var template;
    template = require("../templates/additionalFeature.haml");
    this.$el.html(template({
      model: this.model
    }));
    return this;
  }
});

module.exports = AdditionalFeatureView;


},{"../templates/additionalFeature.haml":12}],17:[function(require,module,exports){
var CenturyLinkProductView;

CenturyLinkProductView = Backbone.View.extend({
  tagName: "tr",
  className: "product",
  initialize: function(options) {},
  render: function() {
    var template;
    template = require("../templates/centuryLinkProduct.haml");
    this.$el.html(template({
      model: this.model
    }));
    return this;
  }
});

module.exports = CenturyLinkProductView;


},{"../templates/centuryLinkProduct.haml":13}],18:[function(require,module,exports){
var CenturyLinkProductView, CenturyLinkProductsView, PubSub;

PubSub = require('../PubSub.coffee');

CenturyLinkProductView = require('../views/CenturyLinkProductView.coffee');

CenturyLinkProductsView = Backbone.View.extend({
  el: "#century-link-products-table",
  productViews: [],
  initialize: function(options) {
    return PubSub.on("inputPanel:change", this.updateProducts, this);
  },
  setCollection: function(productsCollection) {
    return this.productsCollection = productsCollection;
  },
  updateProducts: function() {
    if (!this.productsCollection) {
      return;
    }
    this.removeProducts();
    if (App.settingsModel.get("matchCPU")) {
      $(".description", this.$el).html("performance equivalent");
    } else {
      $(".description", this.$el).html("resource allocation equivalent");
    }
    return this.productsCollection.each((function(_this) {
      return function(product) {
        var productView;
        productView = new CenturyLinkProductView({
          model: product
        });
        $("table", _this.$el).append(productView.render().el);
        return _this.productViews.push(productView);
      };
    })(this));
  },
  removeProducts: function() {
    return _.each(this.productViews, (function(_this) {
      return function(productView) {
        return productView.remove();
      };
    })(this));
  }
});

module.exports = CenturyLinkProductsView;


},{"../PubSub.coffee":2,"../views/CenturyLinkProductView.coffee":17}],19:[function(require,module,exports){
var AdditionalFeatureView, InputPanelView, PubSub, SettingsModel;

PubSub = require('../PubSub.coffee');

SettingsModel = require('../models/SettingsModel.coffee');

AdditionalFeatureView = require('./AdditionalFeatureView.coffee');

InputPanelView = Backbone.View.extend({
  el: "#input-panel",
  events: {
    "change .platform-select": "onPlatformChanged",
    "keypress .number": "ensureNumber",
    "change select": "onFormChanged",
    "keyup input": "onFormChanged",
    "change input[type=checkbox]": "onFormChanged",
    "click .share-btn": "openSharePanel",
    "click .reset-btn": "resetForm"
  },
  initialize: function(options) {
    this.options = options || {};
    this.listenTo(this.model, 'change', this.render);
    this.render();
    this.initPlatforms();
    this.onPlatformChanged();
    return $('.has-tooltip', this.$el).tooltip();
  },
  render: function() {
    var key, value, _ref, _results;
    _ref = this.model.attributes;
    _results = [];
    for (key in _ref) {
      value = _ref[key];
      if (key === "os" || key === "snapshots") {
        _results.push($("option[value=" + value + "]", this.$el).attr("selected", "selected"));
      } else if (key === "matchIOPS" || key === "matchCPU") {
        _results.push($("input[name=" + key + "]", this.$el).attr("checked", value));
      } else {
        _results.push($("input[name=" + key + "]", this.$el).val(value));
      }
    }
    return _results;
  },
  onPlatformChanged: function() {
    var platformKey;
    platformKey = $("#platform-select", this.$el).val();
    PubSub.trigger("platform:change", {
      platformKey: platformKey
    });
    return this.buildPlatformAdditionalFeatures();
  },
  onFormChanged: function() {
    var data;
    data = Backbone.Syphon.serialize(this);
    data = this.updateIOPS(data);
    this.model.set(data);
    return PubSub.trigger("inputPanel:change", data);
  },
  resetForm: function(e) {
    e.preventDefault();
    this.model.clear().set(this.model.defaults);
    return PubSub.trigger("inputPanel:change", this.model.defaults);
  },
  initPlatforms: function() {
    return this.options.platforms.each(function(platform) {
      return $("#platform-select", this.$el).append("<option value='" + (platform.get("key")) + "'>" + (platform.get("name")) + "</option>");
    });
  },
  updateIOPS: function(data) {
    var iops;
    if (data.matchIOPS) {
      iops = App.clcBenchmarking.iops;
      $("input[name=manual-iops]", this.$el).val("");
      $("input[name=manual-iops]").attr("disabled", true);
    } else {
      iops = $("input[name=manual-iops]", this.$el).val();
      $("input[name=manual-iops]").attr("disabled", false);
      iops = Math.max(iops, 0);
    }
    iops = Math.round(iops);
    $(".provisioned-iops", this.$el).html(iops);
    $("input[name=iops]", this.$el).val(iops);
    data = Backbone.Syphon.serialize(this);
    PubSub.trigger("inputPanel:change", data);
    return data;
  },
  buildPlatformAdditionalFeatures: function() {
    var features;
    features = App.platform.get("additionalFeatures");
    _.each(this.additionalFeatures, (function(_this) {
      return function(additionalFeatureView) {
        return additionalFeatureView.remove();
      };
    })(this));
    this.additionalFeatures = [];
    return _.each(features, (function(_this) {
      return function(feature) {
        var additionalFeatureView;
        additionalFeatureView = new AdditionalFeatureView({
          model: feature
        });
        $(".additional-features", _this.$el).append(additionalFeatureView.render().el);
        return _this.additionalFeatures.push(additionalFeatureView);
      };
    })(this));
  },
  openSharePanel: function(e) {
    var shareLink;
    e.preventDefault();
    shareLink = location.href + "#" + JSON.stringify(this.model.attributes);
    $(".share-link").val(shareLink);
    $(".share-link").attr("href", shareLink);
    $(".share-section").slideDown(300);
    $("#input-panel").slideUp(300);
    $(".share-link")[0].select();
    $(".ok-btn").off();
    return $(".ok-btn").click(function(e) {
      e.preventDefault();
      $(".share-section").slideUp(300);
      return $("#input-panel").slideDown(300);
    });
  },
  ensureNumber: function(e) {
    var charCode;
    charCode = (e.which ? e.which : e.keyCode);
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      return true;
    }
  }
});

module.exports = InputPanelView;


},{"../PubSub.coffee":2,"../models/SettingsModel.coffee":11,"./AdditionalFeatureView.coffee":16}],20:[function(require,module,exports){
var PlatformProductView;

PlatformProductView = Backbone.View.extend({
  tagName: "tr",
  className: "product",
  initialize: function(options) {},
  render: function() {
    var template;
    template = require("../templates/platformProduct.haml");
    this.$el.html(template({
      model: this.model
    }));
    return this;
  }
});

module.exports = PlatformProductView;


},{"../templates/platformProduct.haml":14}],21:[function(require,module,exports){
var PlatformProductView, PlatformProductsView, PubSub;

PubSub = require('../PubSub.coffee');

PlatformProductView = require('../views/PlatformProductView.coffee');

PlatformProductsView = Backbone.View.extend({
  el: "#platform-products-table",
  productViews: [],
  initialize: function(options) {
    return PubSub.on("inputPanel:change", this.updateProducts, this);
  },
  setCollection: function(productsCollection) {
    return this.productsCollection = productsCollection;
  },
  updateProducts: function() {
    if (!this.productsCollection) {
      return;
    }
    this.removeProducts();
    return this.productsCollection.each((function(_this) {
      return function(product) {
        var productView;
        productView = new PlatformProductView({
          model: product
        });
        $("table", _this.$el).append(productView.render().el);
        return _this.productViews.push(productView);
      };
    })(this));
  },
  removeProducts: function() {
    return _.each(this.productViews, (function(_this) {
      return function(productView) {
        return productView.remove();
      };
    })(this));
  }
});

module.exports = PlatformProductsView;


},{"../PubSub.coffee":2,"../views/PlatformProductView.coffee":20}],22:[function(require,module,exports){
var VarianceView;

VarianceView = Backbone.View.extend({
  tagName: "tr",
  className: "variance",
  initialize: function(options) {},
  render: function() {
    var template;
    template = require("../templates/variance.haml");
    this.$el.html(template({
      model: this.model
    }));
    if (this.model.savings() > 0) {
      this.$el.addClass("green");
    } else {
      this.$el.addClass("red");
    }
    return this;
  }
});

module.exports = VarianceView;


},{"../templates/variance.haml":15}],23:[function(require,module,exports){
var PubSub, VarianceView, VariancesView;

PubSub = require('../PubSub.coffee');

VarianceView = require('../views/VarianceView.coffee');

VariancesView = Backbone.View.extend({
  el: "#variances-table",
  varianceViews: [],
  initialize: function(options) {
    return PubSub.on("inputPanel:change", this.updateProducts, this);
  },
  setCollection: function(productsCollection) {
    return this.productsCollection = productsCollection;
  },
  updateProducts: function() {
    if (!this.productsCollection) {
      return;
    }
    this.removeProducts();
    return this.productsCollection.each((function(_this) {
      return function(product) {
        var varianceView;
        varianceView = new VarianceView({
          model: product
        });
        $("table", _this.$el).append(varianceView.render().el);
        return _this.varianceViews.push(varianceView);
      };
    })(this));
  },
  removeProducts: function() {
    return _.each(this.varianceViews, (function(_this) {
      return function(varianceView) {
        return varianceView.remove();
      };
    })(this));
  }
});

module.exports = VariancesView;


},{"../PubSub.coffee":2,"../views/VarianceView.coffee":22}],24:[function(require,module,exports){
var CenturyLinkProductsView, Config, DEFAULT_BENCHMARKING, DEFAULT_PLATFORMS, DEFAULT_PRICING, InputPanelView, PRICES_URL_ROOT, PlatformProductsView, PlatformsCollection, ProductsCollection, PubSub, Router, SettingsModel, VariancesView;

Config = require('./app/Config.coffee');

PubSub = require('./app/PubSub.coffee');

Router = require('./app/Router.coffee');

InputPanelView = require('./app/views/InputPanelView.coffee');

PlatformProductsView = require('./app/views/PlatformProductsView.coffee');

VariancesView = require('./app/views/VariancesView.coffee');

CenturyLinkProductsView = require('./app/views/CenturyLinkProductsView.coffee');

SettingsModel = require('./app/models/SettingsModel.coffee');

PlatformsCollection = require('./app/collections/PlatformsCollection.coffee');

ProductsCollection = require('./app/collections/ProductsCollection.coffee');

DEFAULT_PRICING = require('./app/data/pricing.coffee');

DEFAULT_BENCHMARKING = require('./app/data/benchmarking.coffee');

DEFAULT_PLATFORMS = require('./app/data/platforms.coffee');

PRICES_URL_ROOT = Config.CLC_PRICING_URL_ROOT;

window.App = {
  readyToInitCount: 0,
  clcBenchmarking: DEFAULT_BENCHMARKING,
  init: function() {
    var dataFromURL;
    dataFromURL = this.getDataFromURL();
    this.settingsModel = new SettingsModel();
    if (dataFromURL) {
      this.settingsModel.set(dataFromURL);
    }
    this.platformsCollection = new PlatformsCollection();
    this.productsCollection = new ProductsCollection();
    this.loadCLCData();
    this.initEvents();
    this.router = new Router();
    return Backbone.history.start();
  },
  initEvents: function() {
    PubSub.on("platform:change", this.onPlatformChange, this);
    PubSub.on("inputPanel:change", this.onInputPanelChange, this);
    PubSub.on("url:change", this.onURLChange, this);
    this.platformsCollection.on("sync", (function(_this) {
      return function() {
        return _this.onPlatformCollectionSync();
      };
    })(this));
    return this.productsCollection.on('reset', (function(_this) {
      return function() {
        return _this.onProductsUpdated();
      };
    })(this));
  },
  onPlatformChange: function(e) {
    var products;
    this.platform = this.platformsCollection.findWhere({
      "key": e.platformKey
    });
    products = this.platform.get("products");
    return this.productsCollection.reset(products);
  },
  onPlatformCollectionSync: function() {
    this.readyToInitCount += 1;
    return this.buildUI();
  },
  onProductsUpdated: function() {
    this.platformProductsView.setCollection(this.productsCollection);
    this.platformProductsView.updateProducts();
    this.centuryLinkProductsView.setCollection(this.productsCollection);
    this.centuryLinkProductsView.updateProducts();
    this.variancesView.setCollection(this.productsCollection);
    return this.variancesView.updateProducts();
  },
  onInputPanelChange: function(data) {},
  onURLChange: function(data) {},
  loadCLCData: function() {
    $.ajax({
      type: "GET",
      url: PRICES_URL_ROOT + "default.json",
      success: (function(_this) {
        return function(data) {
          _this.clcPricing = _this.parsePricingData(data);
          return _this.onPricingSync();
        };
      })(this),
      error: (function(_this) {
        return function(error) {
          console.error(error);
          _this.clcPricing = DEFAULT_PRICING;
          return _this.onPricingSync();
        };
      })(this)
    });
    return this;
  },
  onPricingSync: function() {
    this.readyToInitCount += 1;
    this.buildUI();
    return this;
  },
  parsePricingData: function(categories) {
    var pricing;
    pricing = _.clone(DEFAULT_PRICING);
    _.each(categories, (function(category) {
      if (category.products != null) {
        return _.each(category.products, function(product) {
          var ids;
          if (_.has(product, 'key')) {
            ids = product.key.split(":");
            switch (ids[0]) {
              case 'server':
                switch (ids[1]) {
                  case 'storage':
                    if (ids[2] === 'standard') {
                      pricing.standardStorage = product.hourly;
                    }
                    if (ids[2] === 'premium') {
                      return pricing.premiumStorage = product.hourly;
                    }
                    break;
                  case 'os':
                    if (ids[2] === 'windows') {
                      pricing.windows = product.hourly;
                    }
                    if (ids[2] === 'redhat') {
                      return pricing.redhat = product.hourly;
                    }
                    break;
                  default:
                    if (ids[1] === 'cpu') {
                      pricing.cpu = product.hourly;
                    }
                    if (ids[1] === 'memory') {
                      return pricing.ram = product.hourly;
                    }
                }
                break;
              case 'networking':
                if (ids[1] === 'bandwidth') {
                  return pricing.bandwidth = product.monthly;
                }
            }
          }
        });
      }
    }));
    return pricing;
  },
  buildUI: function() {
    if (this.readyToInitCount !== 2) {
      return;
    }
    this.platformProductsView = new PlatformProductsView();
    this.centuryLinkProductsView = new CenturyLinkProductsView();
    this.variancesView = new VariancesView();
    return this.inputPanelView = new InputPanelView({
      model: this.settingsModel,
      platforms: this.platformsCollection
    });
  },
  getDataFromURL: function() {
    var data, dataString;
    if (location.hash.length > 10) {
      dataString = location.hash.substring(1);
      data = JSON.parse(dataString);
      location.hash = "";
      history.pushState("", document.title, window.location.pathname);
      return data;
    } else {
      return null;
    }
  }
};

$(function() {
  return App.init();
});


},{"./app/Config.coffee":1,"./app/PubSub.coffee":2,"./app/Router.coffee":3,"./app/collections/PlatformsCollection.coffee":4,"./app/collections/ProductsCollection.coffee":5,"./app/data/benchmarking.coffee":6,"./app/data/platforms.coffee":7,"./app/data/pricing.coffee":8,"./app/models/SettingsModel.coffee":11,"./app/views/CenturyLinkProductsView.coffee":18,"./app/views/InputPanelView.coffee":19,"./app/views/PlatformProductsView.coffee":21,"./app/views/VariancesView.coffee":23}]},{},[24])