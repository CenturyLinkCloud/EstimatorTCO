PlatformProductView = Backbone.View.extend
  
  tagName: "tr"
  className: "product"

  initialize: (options) ->
    @app = options.app || {}
  render: ->
    template = require "../templates/platformProduct.haml"
    @$el.html template(model: @model, app: @app)
    $('.has-tooltip', @$el).on('click', (e) ->
      e.preventDefault()
      return false
    ).tooltip()
    return @

module.exports = PlatformProductView
