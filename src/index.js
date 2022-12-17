const express = require('express')
const redisClient = require('./cache/redis-client')
const { rateProviders } = require('./configs')
const ConverterManager = require('./converter/converter-manager')
const AbstractCurrency = require('./currency/abstract-currency')
const CurrenciesContainer = require('./currency/currencies-container')
const FixerRateProvider = require('./rate/providers/fixer-rate-provider')
const RateCacheManager = require('./rate/rate-cache-manager')
const RateManager = require('./rate/rate-manager')

const poolRateProviders = [
  new FixerRateProvider(rateProviders.fixer.baseUrl, process.env.FIXER_APIKEY)
]

const currenciesContainer = new CurrenciesContainer()
currenciesContainer
  .setCurrency(new AbstractCurrency('BRL'))
  .setCurrency(new AbstractCurrency('USD'))
  .setCurrency(new AbstractCurrency('EUR'))
  .setCurrency(new AbstractCurrency('INR'))

const rateCacheManager = new RateCacheManager(redisClient, currenciesContainer)
const rateManager = new RateManager(poolRateProviders, rateCacheManager)
const converter = new ConverterManager(currenciesContainer, rateManager)


const app = express()

app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', require('./gateway-api/router')(currenciesContainer, converter))

module.exports = app
