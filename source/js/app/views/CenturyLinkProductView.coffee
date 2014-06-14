CenturyLinkProductView = Backbone.View.extend
  
  tagName: "tr"
  className: "product"

  initialize: (options) ->

  render: ->
    template = require "../templates/centuryLinkProduct.haml"
    @$el.html template(model: @model)
    return @

module.exports = CenturyLinkProductView
