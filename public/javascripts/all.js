(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = _.extend({}, Backbone.Events);


},{}],2:[function(require,module,exports){
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


},{"./PubSub.coffee":1}],3:[function(require,module,exports){
var PlatformCollection, PlatformModel;

PlatformModel = require('../models/PlatformModel.coffee');

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


},{"../models/PlatformModel.coffee":5}],4:[function(require,module,exports){
var ProductCollection, ProductModel;

ProductModel = require('../models/ProductModel.coffee');

ProductCollection = Backbone.Collection.extend({
  model: ProductModel,
  initialize: function() {}
});

module.exports = ProductCollection;


},{"../models/ProductModel.coffee":6}],5:[function(require,module,exports){
var PlatformModel;

PlatformModel = Backbone.Model.extend({
  initialize: function() {}
});

module.exports = PlatformModel;


},{}],6:[function(require,module,exports){
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


},{}],7:[function(require,module,exports){
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


},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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


},{"../templates/additionalFeature.haml":8}],13:[function(require,module,exports){
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


},{"../templates/centuryLinkProduct.haml":9}],14:[function(require,module,exports){
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


},{"../PubSub.coffee":1,"../views/CenturyLinkProductView.coffee":13}],15:[function(require,module,exports){
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
    } else {
      iops = $("input[name=manual-iops]", this.$el).val();
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


},{"../PubSub.coffee":1,"../models/SettingsModel.coffee":7,"./AdditionalFeatureView.coffee":12}],16:[function(require,module,exports){
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


},{"../templates/platformProduct.haml":10}],17:[function(require,module,exports){
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


},{"../PubSub.coffee":1,"../views/PlatformProductView.coffee":16}],18:[function(require,module,exports){
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


},{"../templates/variance.haml":11}],19:[function(require,module,exports){
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


},{"../PubSub.coffee":1,"../views/VarianceView.coffee":18}],20:[function(require,module,exports){
var CenturyLinkProductsView, InputPanelView, PlatformProductsView, PlatformsCollection, ProductsCollection, PubSub, Router, SettingsModel, VariancesView;

PubSub = require('./app/PubSub.coffee');

Router = require('./app/Router.coffee');

InputPanelView = require('./app/views/InputPanelView.coffee');

PlatformProductsView = require('./app/views/PlatformProductsView.coffee');

VariancesView = require('./app/views/VariancesView.coffee');

CenturyLinkProductsView = require('./app/views/CenturyLinkProductsView.coffee');

SettingsModel = require('./app/models/SettingsModel.coffee');

PlatformsCollection = require('./app/collections/PlatformsCollection.coffee');

ProductsCollection = require('./app/collections/ProductsCollection.coffee');

window.App = {
  readyToInitCount: 0,
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
    return $.getJSON("json/clc.json", (function(_this) {
      return function(data) {
        _this.clcPricing = data.pricing;
        _this.clcBenchmarking = data.benchmarking;
        _this.readyToInitCount += 1;
        return _this.buildUI();
      };
    })(this));
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


},{"./app/PubSub.coffee":1,"./app/Router.coffee":2,"./app/collections/PlatformsCollection.coffee":3,"./app/collections/ProductsCollection.coffee":4,"./app/models/SettingsModel.coffee":7,"./app/views/CenturyLinkProductsView.coffee":14,"./app/views/InputPanelView.coffee":15,"./app/views/PlatformProductsView.coffee":17,"./app/views/VariancesView.coffee":19}]},{},[20])