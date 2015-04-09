Config = 
  NAME: "TCO Estimator"
  CLC_PRICING_URL_ROOT: "/prices/"
  SOURCE_CURRENCY_ID: "USD"
  CURRENCY_FILE_PATH: "./json/exchange-rates.json"
  PLATFORMS_DATA: "./json/platforms.json"
  init: (app) ->
    $.getJSON('./json/data-config.json', (data) =>
      config = data
      console.log data
      @CLC_PRICING_URL_ROOT = config.pricingRootPath
      @SOURCE_CURRENCY_ID = config.defaultCurrency.id
      @CURRENCY_FILE_PATH = config.currencyFile
      @PLATFORMS_DATA = config.platformsFile
      return app.getCurrencyDataThenInit()
    )



module.exports = Config