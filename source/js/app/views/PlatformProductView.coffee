PlatformProductView = Backbone.View.extend
  
  tagName: "tr"
  className: "product"

  initialize: (options) ->
    @app = options.app || {}
  render: ->
    template = require "../templates/platformProduct.haml"
    @$el.html template(model: @model, app: @app)
    return @

module.exports = PlatformProductView
