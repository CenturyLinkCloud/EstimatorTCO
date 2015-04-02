SettingsModel = Backbone.Model.extend
    
  defaults:
    platform: "azure"
    quantity: 1
    os: "windows"
    storage: 215
    bandwidth: 200
    snapshots: 5
    matchCPU: false
    matchIOPS: false
    iops: 0
    additionalFeatures: []
    currency:
        symbol: "$"
        id: "USD"
        rate: 1.0

  initialize: ->

module.exports = SettingsModel