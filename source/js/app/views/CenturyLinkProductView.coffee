CenturyLinkProductView = Backbone.View.extend
  
  tagName: "tr"
  className: "product"

  initialize: (options) ->
    @app = options.app || {}
  render: ->
    template = require "../templates/centuryLinkProduct.haml"
    @$el.html template(model: @model, app: @app)
    return @

module.exports = CenturyLinkProductView
