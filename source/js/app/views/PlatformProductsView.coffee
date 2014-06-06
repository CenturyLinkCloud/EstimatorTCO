PubSub = require '../PubSub.coffee'

PlatformProductsView = Backbone.View.extend
  
  el: "#platform-products-table"

  initialize: (options) ->
    console.log "platform"


module.exports = PlatformProductsView
