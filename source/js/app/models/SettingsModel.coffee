SettingsModel = Backbone.Model.extend
    
  defaults:
    platform: "aws"
    quantity: 1
    os: "linux"
    storage: 100
    bandwidth: 1000
    snapshots: 5
    matchCPU: false
    matchIOPS: false
    loadBalancing: false
    pricingTier: "standard"
    iops: 0
    additionalFeatures: []
    currencyId: "USD"

  initialize: ->

module.exports = SettingsModel