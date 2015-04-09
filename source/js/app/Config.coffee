Config = 
  NAME: "TCO Estimator"
  PRICING_URL: "/prices/default.json"
  DEFAULT_CURRENCY_ID: "USD"
  CURRENCY_URL: "./json/exchange-rates.json"
  PLATFORMS_URL: "./json/platforms.json"
  BENCHMARKING_URL: "./json/benchmarking.json"
  DEFAULT_PRICING_URL: "./json/default-pricing.json"
  init: (app) ->
    $.getJSON('./json/data-config.json', (data) =>
      config = data
      @NAME = config.name if config.name?
      @PRICING_URL = config.pricingUrl if config.pricingUrl?
      @DEFAULT_CURRENCY_ID = config.defaultCurrency.id if config.defaultCurrency?
      @CURRENCY_URL = config.currencyUrl if config.currencyUrl?
      @PLATFORMS_URL = config.platformsUrl if config.platformsUrl?
      @BENCHMARKING_URL = config.benchmarkingUrl if config.benchmarkingUrl?
      @DEFAULT_PRICING_URL = config.defaultPricingUrl if config.defaultPricingUrl?
      return app.getCurrencyDataThenInit()
    )



module.exports = Config