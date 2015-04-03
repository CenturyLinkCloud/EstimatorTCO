PlatformProductTemplate = require "../templates/platformProduct.haml"

PlatformProductView = Backbone.View.extend
  
  template: PlatformProductTemplate
  tagName: "tr"
  className: "product"

  initialize: (options) ->
    @app = options.app || {}
  render: ->
    @$el.html @template(model: @model, app: @app)
    return @

  initTooltips: ->
    $('.has-tooltip', @$el).off('click').on('click', (e) ->
      e.preventDefault()
      return false
    ).tooltip()

module.exports = PlatformProductView
