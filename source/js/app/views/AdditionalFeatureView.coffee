AdditionalFeatureView = Backbone.View.extend

  tagName: "span"  
  className: "additional-feature"

  initialize: (options) ->
    @options = options || {};
  
  render: ->
    template = require "../templates/additionalFeature.haml"
    @$el.html template(model: @model, selected: @options.selected)

    return @

module.exports = AdditionalFeatureView
