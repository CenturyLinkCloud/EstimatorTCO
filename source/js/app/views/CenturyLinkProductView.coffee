CenturyLinkProductTemplate = require "../templates/centuryLinkProduct.haml"

CenturyLinkProductView = Backbone.View.extend
  
  template: CenturyLinkProductTemplate
  tagName: "tr"
  className: "product"

  initialize: (options) ->
    @app = options.app || {}
  render: ->
    @$el.html @template(model: @model, app: @app)
    return @

module.exports = CenturyLinkProductView
