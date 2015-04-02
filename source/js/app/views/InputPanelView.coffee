PubSub = require '../PubSub.coffee'
SettingsModel = require '../models/SettingsModel.coffee'
AdditionalFeatureView = require './AdditionalFeatureView.coffee'

InputPanelView = Backbone.View.extend
  
  el: "#input-panel"

  events:
    "change #platform-select": "onPlatformChanged"
    "change #currency-select": "onCurrencyChanged"
    "keypress .number": "ensureNumber"
    "change select": "onFormChanged"
    "keyup input": "onFormChanged"
    "change input[type=checkbox]": "onFormChanged"
    "click .share-btn": "openSharePanel"
    "click .reset-btn": "resetForm"

  initialize: (options) ->
    @options = options || {}
    @app = options.app || {}

    @.listenTo @model, 'change', @render
    # @.listenTo @model, 'change', @onFormChanged

    @render()
    @initPlatforms()
    @onPlatformChanged()

    $('.has-tooltip', @$el).tooltip()
   
  render: ->
    for key, value of @model.attributes
      if key is "os" or key is "snapshots" or key is "serviceTier"
        $("option[value=#{value}]", @$el).attr("selected", "selected")
      else if key is "matchIOPS" or key is "matchCPU" or key is "loadBalancing"
        $("input[name=#{key}]", @$el).attr("checked", value)
      else
        $("input[name=#{key}]", @$el).val(value)

  onPlatformChanged: ->

    platformKey = $("#platform-select", @$el).val()
    if platformKey is 'azure'
      $(".load-balancing", @$el).show()
      $("span.platform-name").text("Azure")
    if platformKey is 'aws'
      $(".load-balancing", @$el).hide()
      $("span.platform-name").text("AWS")

    $('.platform-image').hide()
    $(".platform-image.#{platformKey}").show()
    PubSub.trigger "platform:change", platformKey: platformKey
    @buildPlatformAdditionalFeatures()

  onCurrencyChanged: ->
    currencyKey = $("#currency-select", @$el).val()
    PubSub.trigger "currency:change", currencyKey: currencyKey
    #FOR NOW
    href = window.top.location.href
    href = href.replace(/\?currency=.*/, "")
    href = "#{href}?currency=#{currencyKey}"
    return window.top.location.href = href

  onFormChanged: ->
    data = Backbone.Syphon.serialize @
    data = @updateIOPS(data)
    @model.set(data)
    PubSub.trigger "inputPanel:change", data

  resetForm: (e) ->
    e.preventDefault()
    @model.clear().set(@model.defaults)
    PubSub.trigger "inputPanel:change", @model.defaults

  initPlatforms: ->
    @options.platforms.each (platform) ->
      $("#platform-select", @$el).append "<option value='#{platform.get("key")}'>#{platform.get("name")}</option>"

  updateIOPS: (data) ->
    if data.matchIOPS
      iops = App.clcBenchmarking.iops
      $("input[name=manual-iops]", @$el).val("")  
      $("input[name=manual-iops]").attr("disabled", true)
    else
      iops = $("input[name=manual-iops]", @$el).val()  
      $("input[name=manual-iops]").attr("disabled", false)
      iops = Math.max(iops, 0)

    iops = Math.round(iops)

    $(".provisioned-iops", @$el).html(iops)
    $("input[name=iops]", @$el).val(iops)
    
    data = Backbone.Syphon.serialize @

    PubSub.trigger "inputPanel:change", data
    return data

  buildPlatformAdditionalFeatures: ->
    features = App.platform.get("additionalFeatures")

    _.each @additionalFeatures, (additionalFeatureView) =>
      additionalFeatureView.remove()

    @additionalFeatures = []
    _.each features, (feature) =>
      additionalFeatureView = new AdditionalFeatureView(model: feature)
      $(".additional-features", @$el).append additionalFeatureView.render().el
      @additionalFeatures.push additionalFeatureView

  openSharePanel: (e) ->
    e.preventDefault()
    shareLink = location.href + "#" + JSON.stringify(@model.attributes)

    $(".share-link").val(shareLink)
    $(".share-link").attr("href", shareLink)

    $(".share-section").slideDown(300)
    $("#input-panel").slideUp(300)

    $(".share-link")[0].select()

    $(".ok-btn").off()
    $(".ok-btn").click (e) ->
      e.preventDefault()
      $(".share-section").slideUp(300)
      $("#input-panel").slideDown(300)      


  ensureNumber: (e) ->
    charCode = (if (e.which) then e.which else e.keyCode)
    if (charCode > 31 and (charCode < 48 or charCode > 57))
      return false
    else
      return true

module.exports = InputPanelView
