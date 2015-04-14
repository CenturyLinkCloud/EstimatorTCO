(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Config;

Config = {
  NAME: "TCO Estimator",
  PRICING_URL: "/prices/default.json",
  DEFAULT_CURRENCY_ID: "USD",
  CURRENCY_URL: "./json/exchange-rates.json",
  PLATFORMS_URL: "./json/platforms.json",
  BENCHMARKING_URL: "./json/benchmarking.json",
  DEFAULT_PRICING_URL: "./json/default-pricing.json",
  init: function(app) {
    return $.getJSON('./json/data-config.json', (function(_this) {
      return function(data) {
        var config;
        config = data;
        if (config.name != null) {
          _this.NAME = config.name;
        }
        if (config.pricingUrl != null) {
          _this.PRICING_URL = config.pricingUrl;
        }
        if (config.defaultCurrency != null) {
          _this.DEFAULT_CURRENCY_ID = config.defaultCurrency.id;
        }
        if (config.currencyUrl != null) {
          _this.CURRENCY_URL = config.currencyUrl;
        }
        if (config.platformsUrl != null) {
          _this.PLATFORMS_URL = config.platformsUrl;
        }
        if (config.benchmarkingUrl != null) {
          _this.BENCHMARKING_URL = config.benchmarkingUrl;
        }
        if (config.defaultPricingUrl != null) {
          _this.DEFAULT_PRICING_URL = config.defaultPricingUrl;
        }
        return app.getCurrencyDataThenInit();
      };
    })(this));
  }
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
var Utils;

Utils = {
  getUrlParameter: function(sParam) {
    var i, sPageURL, sParameterName, sURLVariables;
    sPageURL = window.location.search.substring(1);
    sURLVariables = sPageURL.split('&');
    i = 0;
    while (i < sURLVariables.length) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
        return sParameterName[1];
      }
      i++;
    }
  }
};

module.exports = Utils;


},{}],5:[function(require,module,exports){
var Config, PlatformCollection, PlatformModel;

PlatformModel = require('../models/PlatformModel.coffee');

Config = require('../Config.coffee');

PlatformCollection = Backbone.Collection.extend({
  model: PlatformModel,
  url: Config.PLATFORMS_URL,
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


},{"../Config.coffee":1,"../models/PlatformModel.coffee":9}],6:[function(require,module,exports){
var ProductCollection, ProductModel;

ProductModel = require('../models/ProductModel.coffee');

ProductCollection = Backbone.Collection.extend({
  model: ProductModel,
  initialize: function() {}
});

module.exports = ProductCollection;


},{"../models/ProductModel.coffee":10}],7:[function(require,module,exports){
module.exports = {
  "iops": 611.74,
  "azure": {
    "loadBalancing": 0.04
  }
};


},{}],8:[function(require,module,exports){
module.exports = {
  "cpu": 0.01,
  "ram": 0.015,
  "standardStorage": 0.0002,
  "premiumStorage": 0.0007,
  "bandwidth": 0.05,
  "windows": 0.04,
  "redhat": 0.04,
  "linux": 0
};


},{}],9:[function(require,module,exports){
var PlatformModel;

PlatformModel = Backbone.Model.extend({
  initialize: function() {},
  parse: function(data) {
    return data;
  }
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
      return iops + ebs;
    } else {
      return 0;
    }
  },
  platformOSPrice: function() {
    var os, price, pricing, tier;
    if (App.platform.get("key") === "aws") {
      if (this.settings.get("os") === "linux") {
        return this.get("price");
      } else {
        return this.get(this.settings.get("os")) + this.get("price");
      }
    } else if (App.platform.get("key") === "azure") {
      tier = this.settings.get("pricingTier");
      os = this.settings.get("os");
      pricing = this.get('pricing')[tier];
      price = pricing[os];
      return pricing[os];
    }
  },
  isPlatformAvailable: function() {
    if (App.platform.get("key") === "aws") {
      return true;
    } else if (App.platform.get("key") === "azure") {
      if (this.platformOSPrice() === 'Unavailable' || this.platformOSPrice() === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  },
  platformTotalPrice: function() {
    var perRCU, subtotal, total;
    if (this.settings.get("iops") > 0) {
      subtotal = this.platformBandwidthPrice() + this.platformIOPSPrice() + this.platformSnapshotPrice() + this.platformOSPrice();
    } else {
      subtotal = this.platformBandwidthPrice() + this.platformIOPSPrice() + this.platformStoragePrice() + this.platformSnapshotPrice() + this.platformStorageIORequests() + this.platformOSPrice();
    }
    total = subtotal * this.settings.get("quantity");
    if (App.platform.get("key") === "aws" || App.platform.get("key") === "azure") {
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
    if (this.platformOSPrice() === 'Unavailable' || this.platformOSPrice() === 0) {
      total = 0;
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
  clcLoadBalancingPrice: function() {
    var loadBalancePrice;
    loadBalancePrice = 0.0;
    if (this.settings.get("platform") === "azure") {
      if (this.settings.get("loadBalancing") === true) {
        loadBalancePrice = App.clcBenchmarking.azure.loadBalancing;
      }
    }
    return loadBalancePrice;
  },
  clcOSPrice: function() {
    return App.clcPricing[this.settings.get("os")] * this.clcEquivalentCpu();
  },
  clcTotalPrice: function() {
    var total;
    total = (this.clcRamPrice() + this.clcCpuPrice() + this.clcDiskPrice() + this.clcBandwidthPrice() + this.clcOSPrice() + this.clcLoadBalancingPrice()) * this.settings.get("quantity");
    if (this.platformOSPrice() === 'Unavailable' || this.platformOSPrice() === 0) {
      total = 0;
    }
    return total;
  },
  variance: function() {
    return this.platformTotalPrice() - this.clcTotalPrice();
  },
  savings: function() {
    if (this.platformOSPrice() === 'Unavailable' || this.platformOSPrice() === 0) {
      return 0;
    } else {
      if (this.settings.get("quantity") > 0) {
        return Math.round((1 - (this.clcTotalPrice()) / this.platformTotalPrice()) * 100);
      } else {
        return 0;
      }
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
    loadBalancing: false,
    pricingTier: "standard",
    iops: 0,
    additionalFeatures: [],
    currencyId: "USD"
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

if (this.model.isPlatformAvailable()) {
  $o.push("<td>" + ($e($c(this.model.clcEquivalentCpu()))) + "</td>\n<td>" + ($e($c(this.model.clcEquivalentRam()))) + "</td>\n<td>" + ($e($c(accounting.formatMoney(this.model.clcTotalPrice() * window.App.currency.rate, {
    precision: 3,
    symbol: this.app.currency.symbol
  })))) + "</td>");
} else {
  $o.push("<td>N/A</td>\n<td>N/A</td>\n<td>N/A</td>");
}

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

if (this.model.isPlatformAvailable()) {
  $o.push("<td class='left-align'>" + ($e($c(this.model.get("name")))) + "</td>\n<td>" + ($e($c(this.model.get("cpu")))) + "</td>\n<td>" + ($e($c(this.model.get("ram")))) + "</td>\n<td>" + ($e($c(accounting.formatMoney(this.model.platformTotalPrice() * window.App.currency.rate, {
    precision: 3,
    symbol: this.app.currency.symbol
  })))) + "</td>");
} else {
  $o.push("<td class='left-align'>");
  $o.push("  " + $e($c(this.model.get("name"))));
  $o.push("  <div class='tooltip-wrapper'>\n    <a class='has-tooltip' href='#' data-toggle='tooltip' data-title='Based on Instance Configuration specific above; Azure Instances A5 through A9 are unavailable with Basic tier virtual machine service.' data-placement='right'></a>\n  </div>\n</td>\n<td>N/A</td>\n<td>N/A</td>\n<td>N/A</td>");
}

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

if (this.model.isPlatformAvailable()) {
  $o.push("<td>" + ($e($c(accounting.formatMoney(this.model.variance() * window.App.currency.rate, {
    precision: 3,
    symbol: this.app.currency.symbol
  })))) + "</td>\n<td>" + ($e($c(accounting.formatMoney(this.model.variance() * 8765.81 * window.App.currency.rate, {
    precision: 2,
    symbol: this.app.currency.symbol
  })))) + "</td>\n<td>" + ($e($c("" + (this.model.savings()) + "%"))) + "</td>");
} else {
  $o.push("<td>N/A</td>\n<td>N/A</td>\n<td>N/A</td>");
}

return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');

}).call(options)
};
},{}],16:[function(require,module,exports){
var AdditionalFeatureTemplate, AdditionalFeatureView;

AdditionalFeatureTemplate = require("../templates/additionalFeature.haml");

AdditionalFeatureView = Backbone.View.extend({
  template: AdditionalFeatureTemplate,
  tagName: "span",
  className: "additional-feature",
  initialize: function(options) {},
  render: function() {
    this.$el.html(this.template({
      model: this.model
    }));
    return this;
  }
});

module.exports = AdditionalFeatureView;


},{"../templates/additionalFeature.haml":12}],17:[function(require,module,exports){
var CenturyLinkProductTemplate, CenturyLinkProductView;

CenturyLinkProductTemplate = require("../templates/centuryLinkProduct.haml");

CenturyLinkProductView = Backbone.View.extend({
  template: CenturyLinkProductTemplate,
  tagName: "tr",
  className: "product",
  initialize: function(options) {
    return this.app = options.app || {};
  },
  render: function() {
    this.$el.html(this.template({
      model: this.model,
      app: this.app
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
    this.app = options.app || {};
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
          model: product,
          app: _this.app
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
var AdditionalFeatureView, Config, InputPanelView, PubSub, SettingsModel;

Config = require('../Config.coffee');

PubSub = require('../PubSub.coffee');

SettingsModel = require('../models/SettingsModel.coffee');

AdditionalFeatureView = require('./AdditionalFeatureView.coffee');

InputPanelView = Backbone.View.extend({
  el: "#input-panel",
  events: {
    "change #platform-select": "onPlatformChanged",
    "change [name='pricingTier']": "onFormChanged",
    "keypress .number": "ensureNumber",
    "change select": "onFormChanged",
    "keyup input": "onFormChanged",
    "change input[type=checkbox]": "onFormChanged",
    "click .share-btn": "openSharePanel",
    "click .reset-btn": "resetForm"
  },
  initialize: function(options) {
    var newCurId, sourceCur;
    this.options = options || {};
    this.app = options.app || {};
    if (this.app.currencyData != null) {
      newCurId = this.model.attributes.currencyId;
      sourceCur = Config.DEFAULT_CURRENCY_ID;
      this.app.currency = this.app.currencyData[sourceCur][newCurId];
    }
    this.listenTo(this.model, 'change', this.render);
    this.initPlatforms();
    this.render();
    this.onPlatformChanged();
    return $('.has-tooltip', this.$el).on('click', function(e) {
      e.preventDefault();
      return false;
    }).tooltip();
  },
  render: function() {
    var key, value, _ref, _results;
    _ref = this.model.attributes;
    _results = [];
    for (key in _ref) {
      value = _ref[key];
      if (key === "os" || key === "snapshots" || key === "pricingTier" || key === "currencyId" || key === "platform") {
        _results.push($("option[value=" + value + "]", this.$el).attr("selected", "selected"));
      } else if (key === "matchIOPS" || key === "matchCPU" || key === "loadBalancing") {
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
    if (platformKey === 'azure') {
      $(".iops", this.$el).hide();
      $(".load-balancing", this.$el).show();
      $(".pricing-tier", this.$el).show();
      $("span.platform-name").text("Azure");
      $("option[value='redhat']").attr("disabled", "disabled");
    }
    if (platformKey === 'aws') {
      $(".iops", this.$el).show();
      $(".pricing-tier", this.$el).hide();
      $(".load-balancing", this.$el).hide();
      $("span.platform-name").text("AWS");
      $("option[value='redhat']").removeAttr("disabled");
    }
    PubSub.trigger("platform:change", {
      platformKey: platformKey
    });
    return this.buildPlatformAdditionalFeatures();
  },
  onFormChanged: function() {
    var data, newCurId, sourceCur;
    data = Backbone.Syphon.serialize(this);
    data = this.updateIOPS(data);
    this.model.set(data);
    if (this.app.currencyData != null) {
      newCurId = this.model.attributes.currencyId;
      sourceCur = Config.DEFAULT_CURRENCY_ID;
      this.app.currency = this.app.currencyData[sourceCur][newCurId];
    }
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
    var rootUrl, shareLink;
    e.preventDefault();
    rootUrl = window.top.location.href;
    if (rootUrl.charAt(rootUrl.length - 1) !== "/") {
      rootUrl += "/";
    }
    shareLink = rootUrl + "#" + JSON.stringify(this.model.attributes);
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


},{"../Config.coffee":1,"../PubSub.coffee":2,"../models/SettingsModel.coffee":11,"./AdditionalFeatureView.coffee":16}],20:[function(require,module,exports){
var PlatformProductTemplate, PlatformProductView;

PlatformProductTemplate = require("../templates/platformProduct.haml");

PlatformProductView = Backbone.View.extend({
  template: PlatformProductTemplate,
  tagName: "tr",
  className: "product",
  initialize: function(options) {
    return this.app = options.app || {};
  },
  render: function() {
    this.$el.html(this.template({
      model: this.model,
      app: this.app
    }));
    return this;
  },
  initTooltips: function() {
    return $('.has-tooltip', this.$el).off('click').on('click', function(e) {
      e.preventDefault();
      return false;
    }).tooltip();
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
    this.app = options.app || {};
    PubSub.on("inputPanel:change", this.updateProducts, this);
    return PubSub.on("platform:change", this.updateImage, this);
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
          model: product,
          app: _this.app
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
  },
  updateImage: function(data) {
    $('.platform-image').hide();
    return $(".platform-image." + data.platformKey).show();
  }
});

module.exports = PlatformProductsView;


},{"../PubSub.coffee":2,"../views/PlatformProductView.coffee":20}],22:[function(require,module,exports){
var VarianceView;

VarianceView = Backbone.View.extend({
  tagName: "tr",
  className: "variance",
  initialize: function(options) {
    return this.app = options.app || {};
  },
  render: function() {
    var template;
    template = require("../templates/variance.haml");
    this.$el.html(template({
      model: this.model,
      app: this.app
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
    this.app = options.app || {};
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
          model: product,
          app: _this.app
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
var CenturyLinkProductsView, Config, DEFAULT_BENCHMARKING, DEFAULT_PRICING, InputPanelView, PlatformProductsView, PlatformsCollection, ProductsCollection, PubSub, Router, SettingsModel, Utils, VariancesView;

Config = require('./app/Config.coffee');

Utils = require('./app/Utils.coffee');

PubSub = require('./app/PubSub.coffee');

Router = require('./app/Router.coffee');

InputPanelView = require('./app/views/InputPanelView.coffee');

PlatformProductsView = require('./app/views/PlatformProductsView.coffee');

VariancesView = require('./app/views/VariancesView.coffee');

CenturyLinkProductsView = require('./app/views/CenturyLinkProductsView.coffee');

SettingsModel = require('./app/models/SettingsModel.coffee');

PlatformsCollection = require('./app/collections/PlatformsCollection.coffee');

ProductsCollection = require('./app/collections/ProductsCollection.coffee');

DEFAULT_PRICING = require('./app/data/default-pricing-object.coffee');

DEFAULT_BENCHMARKING = require('./app/data/benchmarking.coffee');

window.App = {
  readyToInitCount: 0,
  clcBenchmarking: DEFAULT_BENCHMARKING,
  currency: {
    symbol: "$",
    rate: 1.0,
    id: "USD"
  },
  init: function() {
    var dataFromURL;
    dataFromURL = this.getDataFromURL();
    $.getJSON(Config.BENCHMARKING_URL, (function(_this) {
      return function(data) {
        if (data != null) {
          return _this.clcBenchmarking = data;
        }
      };
    })(this));
    $.getJSON(Config.DEFAULT_PRICING_URL, (function(_this) {
      return function(data) {
        if (data != null) {
          return DEFAULT_PRICING = data;
        }
      };
    })(this));
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
      url: Config.PRICING_URL,
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
    this.platformProductsView = new PlatformProductsView({
      app: this
    });
    this.centuryLinkProductsView = new CenturyLinkProductsView({
      app: this
    });
    this.variancesView = new VariancesView({
      app: this
    });
    return this.inputPanelView = new InputPanelView({
      model: this.settingsModel,
      platforms: this.platformsCollection,
      app: this
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
  },
  getCurrencyDataThenInit: function() {
    if (this.currencyData == null) {
      return $.ajax({
        url: Config.CURRENCY_URL,
        type: "GET",
        success: (function(_this) {
          return function(data) {
            var $currencySelect;
            _this.currencyData = data;
            $currencySelect = $("#currency-select");
            $currencySelect.html('');
            _.each(data[Config.DEFAULT_CURRENCY_ID], function(currency) {
              var $option, extra;
              extra = currency.id === Config.DEFAULT_CURRENCY_ID ? "" : " (" + currency.rate + " x " + Config.DEFAULT_CURRENCY_ID + ")";
              $option = $("<option value='" + currency.id + "'>" + currency.id + extra + "</option>");
              return $currencySelect.append($option);
            });
            return setTimeout(_this.init(), 500);
          };
        })(this),
        error: (function(_this) {
          return function(error) {
            var $currencySelect, $option;
            $currencySelect = $("#currency-select");
            $option = $("<option value='" + Config.DEFAULT_CURRENCY_ID + "'>" + Config.DEFAULT_CURRENCY_ID + "</option>");
            $currencySelect.append($option);
            return setTimeout(_this.init(), 500);
          };
        })(this)
      });
    }
  }
};

$(function() {
  return Config.init(App);
});


},{"./app/Config.coffee":1,"./app/PubSub.coffee":2,"./app/Router.coffee":3,"./app/Utils.coffee":4,"./app/collections/PlatformsCollection.coffee":5,"./app/collections/ProductsCollection.coffee":6,"./app/data/benchmarking.coffee":7,"./app/data/default-pricing-object.coffee":8,"./app/models/SettingsModel.coffee":11,"./app/views/CenturyLinkProductsView.coffee":18,"./app/views/InputPanelView.coffee":19,"./app/views/PlatformProductsView.coffee":21,"./app/views/VariancesView.coffee":23}]},{},[24])