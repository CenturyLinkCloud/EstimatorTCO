ProductModel = Backbone.Model.extend

  HOURS_PER_MONTH: 730

  initialize: ->
    @settings = App.settingsModel
    @platformBenchmarking = App.platform.get("benchmarking")
    @platformPricing = App.platform.get("pricing")
    @platformAdditionalFeatures = App.platform.get("additionalFeatures")

  #--------------------------------------------------------
  # Platform Pricing
  #--------------------------------------------------------
  
  platformBandwidthPrice: ->
    @settings.get("bandwidth") * @platformPricing.bandwidthOutbound / @HOURS_PER_MONTH

  platformStoragePrice: ->
    @settings.get("storage") * @platformPricing.standardPerGB / @HOURS_PER_MONTH
  
  platformStorageIORequests: ->
    5 * @platformPricing.perMillionRequests / @HOURS_PER_MONTH
  
  platformSnapshotCapacityUtilized: ->
    (@settings.get("storage") * @platformPricing.firstSnapshot) + (@settings.get("snapshots") - 1) * @platformPricing.remainingSnapshotsEach * @settings.get("storage")
  
  platformSnapshotPrice: ->
    (@platformSnapshotCapacityUtilized() * @platformPricing.snapshotPerGB) / @HOURS_PER_MONTH

  platformOSPrice: ->
    if @settings.get("os") is "linux"
      return 0
    else
      return @.get(@settings.get("os"))

  platformTotalPrice: ->
    subtotal = (@.get("price") + @platformBandwidthPrice() + @platformStoragePrice() + @platformSnapshotPrice() + @platformStorageIORequests() + @platformOSPrice()) * @settings.get("quantity")
    total = subtotal
    
    # AWS Specific extras
    if App.platform.get("key") is "aws"

      # MCM
      if @settings.get("mcm")
        total += _.findWhere( @platformAdditionalFeatures, {"key": "mcm"}).pricing

      # AlertLogic
      if @settings.get("alertLogic")
        total += _.findWhere( @platformAdditionalFeatures, {"key": "alertLogic"}).pricing      

      # RightScale
      if @settings.get("rightScale")
        perRCU = _.findWhere( @platformAdditionalFeatures, {"key": "rightScale"}).pricing
        total += @.get("rightScaleRCU") * perRCU

    return total

  #--------------------------------------------------------
  # CLC Pricing
  #--------------------------------------------------------

  clcEquivalentRam: ->
    if @settings.get("matchCPU")
      Math.ceil(@.get("ram") / @platformBenchmarking.ram)
    else
      @.get("ram")

  clcEquivalentCpu: ->
    if @settings.get("matchCPU")
      Math.ceil(@.get("cpu") / @platformBenchmarking.cpu)
    else
      @.get("cpu")

  clcRamPrice: ->
    @clcEquivalentRam() * App.clcPricing.ram

  clcCpuPrice: ->
    @clcEquivalentCpu() * App.clcPricing.cpu

  clcBandwithPrice: ->
    @settings.get("storage") * App.clcPricing.standardStorage

  clcDiskPrice: ->
    @settings.get("bandwidth") * App.clcPricing.bandwidth / @HOURS_PER_MONTH

  clcOSPrice: ->
    App.clcPricing[@settings.get("os")] * @.get("cpu")

  clcTotalPrice: ->
    (@clcRamPrice() + @clcCpuPrice() + @clcDiskPrice() + @clcBandwithPrice() + @clcOSPrice()) * @settings.get("quantity")


  #--------------------------------------------------------
  # Variance
  #--------------------------------------------------------

  variance: ->
    @platformTotalPrice() - @clcTotalPrice()

  savings: ->
    if @settings.get("quantity") > 0
      return Math.round((1 - @clcTotalPrice() / @platformTotalPrice()) * 100)
    else
      return 0


module.exports = ProductModel