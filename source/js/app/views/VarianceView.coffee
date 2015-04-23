VarianceView = Backbone.View.extend
  
  tagName: "tr"
  className: "variance"

  initialize: (options) ->
    @app = options.app || {}
  render: ->
    template = require "../templates/variance.haml"
    @$el.html template(model: @model, app: @app)

    if @model.savings() > 0
      @$el.addClass("green")
    else
      @$el.addClass("red")

    return @

module.exports = VarianceView
