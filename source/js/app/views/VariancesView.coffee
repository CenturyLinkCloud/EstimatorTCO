PubSub = require '../PubSub.coffee'
VarianceView = require '../views/VarianceView.coffee'

VariancesView = Backbone.View.extend
  
  el: "#variances-table"
  varianceViews: []

  initialize: (options) ->
    @app = options.app || {}
    PubSub.on("inputPanel:change", @updateProducts, @)

  setCollection: (productsCollection) ->
    @productsCollection = productsCollection

  updateProducts: ->
    return unless @productsCollection
    @removeProducts()
    @productsCollection.each (product) =>
      varianceView = new VarianceView 
        model: product
        app: @app
      $("table", @$el).append varianceView.render().el
      @varianceViews.push varianceView

  removeProducts: ->
    _.each @varianceViews, (varianceView) =>
      varianceView.remove()

module.exports = VariancesView