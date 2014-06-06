PubSub = require '../PubSub.coffee'
SettingsModel = require '../models/SettingsModel.coffee'

InputPanelView = Backbone.View.extend
  
  el: "#input-panel"

  events:
    "change .platform-select": "onPlatformChanged"
    "keypress .number": "ensureNumber"
    "change select[name]": "onFormChanged"
    "change input[name]": "onFormChanged"
    "input input[name]": "onFormChanged"
    "keyup input[name]": "onFormChanged"

  initialize: (options) ->
   
  onPlatformChanged: ->
    PubSub.trigger("inputPanel:change")
    data = Backbone.Syphon.serialize @

  onFormChanged: ->
    data = Backbone.Syphon.serialize @
    @model.set(data)

  ensureNumber: (e) ->
    charCode = (if (e.which) then e.which else e.keyCode)
    return not (charCode > 31 and (charCode < 48 or charCode > 57))

module.exports = InputPanelView
