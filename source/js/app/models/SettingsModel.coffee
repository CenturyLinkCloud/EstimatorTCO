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
    iops: 0
    additionalFeatures: []

  initialize: ->

module.exports = SettingsModel