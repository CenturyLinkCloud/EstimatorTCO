PubSub = require '../PubSub.coffee'
CenturyLinkProductView = require '../views/CenturyLinkProductView.coffee'

CenturyLinkProductsView = Backbone.View.extend
  
  el: "#century-link-products-table"
  productViews: []

  initialize: (options) ->
    PubSub.on("inputPanel:change", @updateProducts, @)

  setCollection: (productsCollection) ->
    @productsCollection = productsCollection

  updateProducts: ->
    return unless @productsCollection
    
    @removeProducts()
    @productsCollection.each (product) =>
      productView = new CenturyLinkProductView model: product
      $("table", @$el).append productView.render().el
      @productViews.push productView

  removeProducts: ->
    _.each @productViews, (productView) =>
      productView.remove()


module.exports = CenturyLinkProductsView