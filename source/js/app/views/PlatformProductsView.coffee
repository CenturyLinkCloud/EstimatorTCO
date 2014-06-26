PubSub = require '../PubSub.coffee'
PlatformProductView = require '../views/PlatformProductView.coffee'

PlatformProductsView = Backbone.View.extend
  
  el: "#platform-products-table"
  productViews: []

  initialize: (options) ->
    PubSub.on("inputPanel:change", @updateProducts, @)

  setCollection: (productsCollection) ->
    @productsCollection = productsCollection

  updateProducts: ->
    return unless @productsCollection

    @removeProducts()
    @productsCollection.each (product) =>
      productView = new PlatformProductView model: product
      $("table", @$el).append productView.render().el
      @productViews.push productView

  removeProducts: ->
    _.each @productViews, (productView) =>
      productView.remove()


module.exports = PlatformProductsView