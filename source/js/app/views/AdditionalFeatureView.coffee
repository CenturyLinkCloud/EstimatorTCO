AdditionalFeatureTemplate = require "../templates/additionalFeature.haml"

AdditionalFeatureView = Backbone.View.extend

  template: AdditionalFeatureTemplate
  tagName: "span"  
  className: "additional-feature"

  initialize: (options) ->

  render: ->
    @$el.html @template(model: @model)

    return @

module.exports = AdditionalFeatureView
