#########################################################
# Title:  Tier 3 - Total Cost of Ownership Tool
# Author: matt@wintr.us @ WINTR
#########################################################


#--------------------------------------------------------
# Imports
#--------------------------------------------------------

PubSub                  = require './app/PubSub.coffee'
Router                  = require './app/Router.coffee'
InputPanelView          = require './app/views/InputPanelView.coffee'
PlatformProductsView    = require './app/views/PlatformProductsView.coffee'
VariancesView           = require './app/views/VariancesView.coffee'
CenturyLinkProductsView = require './app/views/CenturyLinkProductsView.coffee'
SettingsModel           = require './app/models/SettingsModel.coffee'
PlatformsCollection     = require './app/collections/PlatformsCollection.coffee'
ProductsCollection      = require './app/collections/ProductsCollection.coffee'
Utils                   = require './app/Utils.coffee'

#--------------------------------------------------------
# Init
#--------------------------------------------------------

window.App = 
  readyToInitCount: 0
  dbUrlBase: "http://10.90.102.15:9200/tco"
  useJSON: false

  init: ->
    @getDataFromURL()

    @settingsModel = new SettingsModel()
    # @settingsModel.set(dataFromURL) if dataFromURL

    @platformsCollection = new PlatformsCollection()
    @productsCollection = new ProductsCollection()

    @loadCLCData()
    @initEvents()
    
    @router = new Router()
    Backbone.history.start()


  #--------------------------------------------------------
  # Event initialization
  #--------------------------------------------------------

  initEvents: ->
    PubSub.on("platform:change", @onPlatformChange, @)
    PubSub.on("inputPanel:change", @onInputPanelChange, @)
    PubSub.on("url:change", @onURLChange, @)
    
    @platformsCollection.on "sync", => @onPlatformCollectionSync()
    @productsCollection.on 'reset', => @onProductsUpdated()
      

  #--------------------------------------------------------
  # Event Listeners
  #--------------------------------------------------------

  onPlatformChange: (e) ->
    @platform = @platformsCollection.findWhere("key": e.platformKey)
    products = @platform.get("products")
    @productsCollection.reset products

  onPlatformCollectionSync: ->
    @readyToInitCount += 1
    @buildUI()

  onProductsUpdated: ->
    @platformProductsView.setCollection @productsCollection
    @platformProductsView.updateProducts()
    
    @centuryLinkProductsView.setCollection @productsCollection
    @centuryLinkProductsView.updateProducts()
    
    @variancesView.setCollection @productsCollection
    @variancesView.updateProducts()

  onInputPanelChange: (data) ->
    # @router.navigate("input/#{JSON.stringify(data)}")

  onURLChange: (data) ->
    # @settingsModel.set data


  #--------------------------------------------------------
  # Load CLC Pricing
  #--------------------------------------------------------

  loadCLCData: ->
    if @useJSON
      clcDataURL = "json/clc.json"
    else
      clcDataURL = "#{App.dbUrlBase}/clc-pricing/1/_source"

    $.getJSON clcDataURL, (response) =>
      data = response.data[0]
      @clcPricing = data.pricing
      @clcBenchmarking = data.benchmarking
      @readyToInitCount += 1
      @buildUI()


  #--------------------------------------------------------
  # Build UI
  #--------------------------------------------------------

  buildUI: ->
    return unless @readyToInitCount is 2
    @platformProductsView = new PlatformProductsView()
    @centuryLinkProductsView = new CenturyLinkProductsView()
    @variancesView = new VariancesView()
    @inputPanelView = new InputPanelView(model: @settingsModel, platforms: @platformsCollection)


  #--------------------------------------------------------
  # Get data from URL
  #--------------------------------------------------------

  getDataFromURL: ->
    shareId = Utils.getUrlParameter("id")

    if shareId
      $.ajax
        type: "GET"
        url: "#{App.dbUrlBase}/estimates/#{shareId}"
        dataType: "json"
        success: (response) =>
          @settingsModel.set(response._source)
        error: (response, status) ->
          console.log "Error", response, status



#--------------------------------------------------------
# DOM Ready
#--------------------------------------------------------

$ ->
  App.init()
