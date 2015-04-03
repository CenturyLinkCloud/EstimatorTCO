#########################################################
# Title:  Tier 3 - Total Cost of Ownership Tool
# Author: matt@wintr.us @ WINTR
#########################################################


#--------------------------------------------------------
# Imports
#--------------------------------------------------------

Config = require './app/Config.coffee'
Utils = require './app/Utils.coffee'
PubSub = require './app/PubSub.coffee'
Router = require './app/Router.coffee'
InputPanelView = require './app/views/InputPanelView.coffee'
PlatformProductsView = require './app/views/PlatformProductsView.coffee'
VariancesView = require './app/views/VariancesView.coffee'
CenturyLinkProductsView = require './app/views/CenturyLinkProductsView.coffee'
SettingsModel = require './app/models/SettingsModel.coffee'
PlatformsCollection = require './app/collections/PlatformsCollection.coffee'
ProductsCollection = require './app/collections/ProductsCollection.coffee'

DEFAULT_PRICING = require './app/data/default-pricing-object.coffee'
DEFAULT_BENCHMARKING = require './app/data/benchmarking.coffee'
PRICES_URL_ROOT = Config.CLC_PRICING_URL_ROOT

#--------------------------------------------------------
# Init
#--------------------------------------------------------

window.App = 
  readyToInitCount: 0
  clcBenchmarking: DEFAULT_BENCHMARKING
  currency:
    symbol: "$"
    rate: 1.0
    id: "USD"

  init: ->
    dataFromURL = @getDataFromURL()

    @settingsModel = new SettingsModel()
    @settingsModel.set(dataFromURL) if dataFromURL

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
    $.ajax
      type: "GET"
      url: PRICES_URL_ROOT + "default.json"
      success: (data) =>
        @clcPricing = @parsePricingData(data)
        return @onPricingSync()
      error: (error) =>
        console.error error
        @clcPricing = DEFAULT_PRICING
        return @onPricingSync()
    return @

  onPricingSync: ->
    @readyToInitCount += 1
    @buildUI()
    return @

  parsePricingData: (categories) ->
    pricing = _.clone DEFAULT_PRICING
    _.each categories,((category) ->
      if category.products?
        _.each category.products, (product) ->
          if _.has(product,'key')
            ids = product.key.split(":")
            switch ids[0]
              when 'server'
                switch ids[1]
                  when 'storage'
                    pricing.standardStorage = product.hourly if ids[2] is 'standard'
                    pricing.premiumStorage = product.hourly if ids[2] is 'premium'
                  when 'os'
                    pricing.windows = product.hourly if ids[2] is 'windows'
                    pricing.redhat = product.hourly if ids[2] is 'redhat'
                  else
                    pricing.cpu = product.hourly if ids[1] is 'cpu'
                    pricing.ram = product.hourly if ids[1] is 'memory'
              when 'networking'
                pricing.bandwidth = product.monthly if ids[1] is 'bandwidth'              
    )

    return pricing


  #--------------------------------------------------------
  # Build UI
  #--------------------------------------------------------

  buildUI: ->
    return unless @readyToInitCount is 2
    @platformProductsView = new PlatformProductsView
      app: @
    @centuryLinkProductsView = new CenturyLinkProductsView
      app: @
    @variancesView = new VariancesView
      app: @
    @inputPanelView = new InputPanelView
      model: @settingsModel
      platforms: @platformsCollection
      app: @


  #--------------------------------------------------------
  # Get data from URL
  #--------------------------------------------------------

  getDataFromURL: ->
    if location.hash.length > 10
      dataString = location.hash.substring(1)
      data = JSON.parse dataString
      location.hash = ""
      history.pushState("", document.title, window.location.pathname)
      return data
    else
      return null


  getCurrencyDataThenInit: ->
    unless @currencyData?
      $.ajax
        url: Config.CURRENCY_FILE_PATH
        type: "GET"
        success: (data) =>
          @currencyData = data
          $currencySelect = $("#currency-select")
          $currencySelect.html('')
          _.each data[Config.SOURCE_CURRENCY_ID], (currency) =>
            extra = if currency.id is Config.SOURCE_CURRENCY_ID then "" else " (#{currency.rate} x #{Config.SOURCE_CURRENCY_ID})"
            $option = $("<option value='#{currency.id}'>#{currency.id}#{extra}</option>")
            $currencySelect.append $option
          return setTimeout(@init(),500)
        error: (error) =>
          $currencySelect = $("#currency-select")
          $option = $("<option value='#{Config.SOURCE_CURRENCY_ID}'>#{Config.SOURCE_CURRENCY_ID}</option>")
          $currencySelect.append $option
          return setTimeout(@init(),500)


#--------------------------------------------------------
# DOM Ready
#--------------------------------------------------------

$ ->
  App.getCurrencyDataThenInit()
