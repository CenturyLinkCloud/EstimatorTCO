#########################################################
# Title:  Tier 3 - Total Cost of Ownership Tool
# Author: matt@wintr.us @ WINTR
#########################################################


#--------------------------------------------------------
# Imports
#--------------------------------------------------------

PubSub = require './app/PubSub.coffee'
InputPanelView = require './app/views/InputPanelView.coffee'
PlatformProductsView = require './app/views/PlatformProductsView.coffee'
SettingsModel = require './app/models/SettingsModel.coffee'


#--------------------------------------------------------
# Init
#--------------------------------------------------------

App = 
  init: ->
    _.extend(@, Backbone.Events)

    # Models
    @settingsModel = new SettingsModel()
      
    # Views
    @inputPanelView = new InputPanelView(model: @settingsModel)
    @platformProductsView = new PlatformProductsView()

    # Events
    @initGlobalEvents()


  #--------------------------------------------------------
  # Event initialization
  #--------------------------------------------------------

  initGlobalEvents: ->
    PubSub.on("inputPanel:change", @onInputPanelChange)


  #--------------------------------------------------------
  # Event Listeners
  #--------------------------------------------------------

  onInputPanelChange: (e) ->
    console.log "on input panel change"


  #--------------------------------------------------------
  # DOM Ready
  #--------------------------------------------------------

$ ->
  App.init()