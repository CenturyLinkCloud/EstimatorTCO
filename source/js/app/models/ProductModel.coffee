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
    if @settings.get("iops") > 0
      storage = 215
    else
     storage = @settings.get("storage") 
    (storage * @platformPricing.firstSnapshot) + (@settings.get("snapshots") - 1) * @platformPricing.remainingSnapshotsEach * storage
  
  platformSnapshotPrice: ->
    (@platformSnapshotCapacityUtilized() * @platformPricing.snapshotPerGB) / @HOURS_PER_MONTH

  platformIOPSPrice: ->
    iops = (@settings.get("iops") * @platformPricing.provisionedIOPSPerMonth) / @HOURS_PER_MONTH
    ebs = (215 * @platformPricing.provisionedPerGB) / @HOURS_PER_MONTH
    if @settings.get("iops") > 0
      # console.log iops, ebs
      return iops + ebs
    else 
      return 0

  platformOSPrice: ->
    if App.platform.get("key") is "aws"
      if @settings.get("os") is "linux"
        return @.get("price")
      else
        return @.get(@settings.get("os")) + @.get("price")

    else if App.platform.get("key") is "azure"
      tier = @settings.get("pricingTier")
      os = @settings.get("os")
      pricing = @.get('pricing')[tier]
      price = pricing[os]
      return pricing[os]

  isPlatformAvailable: ->
    if App.platform.get("key") is "aws"
      return true
    else if App.platform.get("key") is "azure"
      if @platformOSPrice() is 'Unavailable' or @platformOSPrice() is 0
        return false
      else
        return true
    else
      return true

  platformTotalPrice: ->
    if @settings.get("iops") > 0
      subtotal = (@platformBandwidthPrice() + @platformIOPSPrice() + 
                  @platformSnapshotPrice() + @platformOSPrice())
    else
      subtotal = (@platformBandwidthPrice() + @platformIOPSPrice() + 
                  @platformStoragePrice() + @platformSnapshotPrice() + @platformStorageIORequests() + 
                  @platformOSPrice())

    total = subtotal * @settings.get("quantity")
    
    # AWS Specific extras
    if App.platform.get("key") is "aws" or App.platform.get("key") is "azure"

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

    if @platformOSPrice() is 'Unavailable' or @platformOSPrice() is 0
      total = 0

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

  clcDiskPrice: ->
    if parseInt(@settings.get("snapshots")) == 5
      price = @settings.get("storage") * App.clcPricing.standardStorage
    else if parseInt(@settings.get("snapshots")) == 14
      price = @settings.get("storage") * App.clcPricing.premiumStorage
    return price

  clcBandwidthPrice: ->
    @settings.get("bandwidth") * App.clcPricing.bandwidth / @HOURS_PER_MONTH

  clcLoadBalancingPrice: ->
    loadBalancePrice = 0.0
    if @settings.get("platform") is "azure"
      if @settings.get("loadBalancing") is true
        loadBalancePrice = App.clcBenchmarking.azure.loadBalancing
    return loadBalancePrice

  clcOSPrice: ->
    App.clcPricing[@settings.get("os")] * @clcEquivalentCpu()

  clcTotalPrice: ->      
    total = (@clcRamPrice() + @clcCpuPrice() + @clcDiskPrice() + @clcBandwidthPrice() + @clcOSPrice() + @clcLoadBalancingPrice()) * @settings.get("quantity")
    if @platformOSPrice() is 'Unavailable' or @platformOSPrice() is 0
      total = 0
    return total

  #--------------------------------------------------------
  # Variance
  #--------------------------------------------------------

  variance: ->
    @platformTotalPrice() - @clcTotalPrice()

  savings: ->
    if @platformOSPrice() is 'Unavailable' or @platformOSPrice() is 0
      return 0
    else
      if @settings.get("quantity") > 0
        return Math.round((1 - (@clcTotalPrice()) / @platformTotalPrice()) * 100)
      else
        return 0


module.exports = ProductModel