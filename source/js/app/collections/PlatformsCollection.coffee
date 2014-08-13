PlatformModel = require '../models/PlatformModel.coffee'

PlatformCollection = Backbone.Collection.extend
  model: PlatformModel

  url: ->
    if App.useJSON
      return "json/platforms.json"
    else
      return "#{App.dbUrlBase}/platforms/1/_source"

  initialize: ->
    @fetch()

  parse: (response) ->
    return response.data

  forKey: (type) ->
    _.first @where("type": type)

module.exports = PlatformCollection