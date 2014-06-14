VarianceView = Backbone.View.extend
  
  tagName: "tr"
  className: "variance"

  initialize: (options) ->

  render: ->
    template = require "../templates/variance.haml"
    @$el.html template(model: @model)

    if @model.savings() > 0
      @$el.addClass("green")
    else
      @$el.addClass("red")

    return @

module.exports = VarianceView
