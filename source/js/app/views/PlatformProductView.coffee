PlatformProductView = Backbone.View.extend
  
  tagName: "tr"
  className: "product"

  initialize: (options) ->

  render: ->
    template = require "../templates/platformProduct.haml"
    @$el.html template(model: @model)
    return @

module.exports = PlatformProductView
