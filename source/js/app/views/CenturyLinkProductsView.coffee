PubSub = require '../PubSub.coffee'
CenturyLinkProductView = require '../views/CenturyLinkProductView.coffee'

CenturyLinkProductsView = Backbone.View.extend
  
  el: "#century-link-products-table"
  productViews: []

  initialize: (options) ->
    @app = options.app || {}
    PubSub.on("inputPanel:change", @updateProducts, @)

  setCollection: (productsCollection) ->
    @productsCollection = productsCollection

  updateProducts: ->
    return unless @productsCollection
    
    @removeProducts()

    if App.settingsModel.get("matchCPU")
      $(".description", @$el).html "performance equivalent"
    else
      $(".description", @$el).html "resource allocation equivalent"

    @productsCollection.each (product) =>
      productView = new CenturyLinkProductView 
        model: product
        app: @app
      $("table", @$el).append productView.render().el
      @productViews.push productView

  removeProducts: ->
    _.each @productViews, (productView) =>
      productView.remove()


module.exports = CenturyLinkProductsView