SettingsModel = Backbone.Model.extend
    
  defaults:
    platform: "aws"
    quantity: 1
    os: "windows"
    storage: 100
    bandwidth: 1000
    snapshots: 5
    matchCPU: false
    matchIOPS: false
    loadBalancing: false
    serviceTier: "standard"
    iops: 0
    additionalFeatures: []
    currency:
        symbol: "$"
        id: "USD"
        rate: 1.0

  initialize: ->

module.exports = SettingsModel