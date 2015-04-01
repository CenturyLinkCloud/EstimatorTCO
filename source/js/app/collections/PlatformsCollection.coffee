PlatformModel = require '../models/PlatformModel.coffee'

PlatformCollection = Backbone.Collection.extend
  model: PlatformModel
  url: "json/platforms.json"

  initialize: ->
    @fetch()

  parse: (data) ->
    rate = window.App.currency.rate
    console.log 'before', data[0]
    platforms = _.clone data
    _.each platforms, (platform, pindex) ->

      _.each platform.additionalFeatures, (feature, index) =>
        platform.additionalFeatures[index].pricing *= rate

      _.each platform.benchmarking, (price, key) =>
        platform.benchmarking[key] *= rate

      _.each platform.pricing, (price, key) =>
        platform.pricing[key] *= rate

      _.each platform.products, (product, index) =>
        platform.products[index].price *= rate
        platform.products[index].redhat *= rate
        platform.products[index].windows *= rate

    console.log 'after', platforms[0]
    return data

  forKey: (type) ->
    _.first @where("type": type)

module.exports = PlatformCollection