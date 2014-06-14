AdditionalFeatureView = Backbone.View.extend

  tagName: "span"  
  className: "additional-feature"

  initialize: (options) ->

  render: ->
    template = require "../templates/additionalFeature.haml"
    @$el.html template(model: @model)

    return @

module.exports = AdditionalFeatureView
