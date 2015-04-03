PubSub = require '../PubSub.coffee'
PlatformProductView = require '../views/PlatformProductView.coffee'

PlatformProductsView = Backbone.View.extend
  
  el: "#platform-products-table"
  productViews: []

  initialize: (options) ->
    @app = options.app || {}
    PubSub.on("inputPanel:change", @updateProducts, @)
    PubSub.on("platform:change", @updateImage, @)

  setCollection: (productsCollection) ->
    @productsCollection = productsCollection

  updateProducts: ->
    return unless @productsCollection

    @removeProducts()
    @productsCollection.each (product) =>
      productView = new PlatformProductView 
        model: product
        app: @app
      $("table", @$el).append productView.render().el
      @productViews.push productView

  removeProducts: ->
    _.each @productViews, (productView) =>
      productView.remove()

  updateImage: (data) ->
    $('.platform-image').hide()
    $(".platform-image.#{data.platformKey}").show()


module.exports = PlatformProductsView