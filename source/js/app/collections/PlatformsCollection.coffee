PlatformModel = require '../models/PlatformModel.coffee'

PlatformCollection = Backbone.Collection.extend
  model: PlatformModel
  url: "json/platforms.json"

  initialize: ->
    @fetch()

  forKey: (type) ->
    _.first @where("type": type)

module.exports = PlatformCollection