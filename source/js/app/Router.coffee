PubSub = require "./PubSub.coffee"

Router = Backbone.Router.extend

  routes: 
    "input/:data": "input"

  input: (data) ->
    PubSub.trigger "url:change", JSON.parse data

module.exports = Router
