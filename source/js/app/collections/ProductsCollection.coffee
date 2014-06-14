ProductModel = require '../models/ProductModel.coffee'

ProductCollection = Backbone.Collection.extend
  model: ProductModel

  initialize: ->

  
module.exports = ProductCollection