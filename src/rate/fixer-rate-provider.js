const fetch = require('node-fetch')
const RateProvider = require('./rate-provider')
const logger = require('../logger')('rate/fixer-rate-provider')

class FixerRateProvider extends RateProvider {
  constructor (baseUrl, apikey) {
    super(baseUrl, apikey)
  }

  #buildUrl (currencyBase) {
    return `${this.getBaseUrl()}?base=${currencyBase}`
  }

  /**
   * @param { string } currencyBase - The currency base value
   * @returns { Promise }
   */
  async fetch (currencyBase) {
    return fetch(this.#buildUrl(currencyBase), {
      headers: {
        apikey: this.getApikey()
      }
    })
      .then(res => res.json())
      .catch(error => {
        logger.error('error to try fetch the rates from Fixer API', error)
        return {
          status: this.STATUS_ERROR
        }
      })
  }

  /**
   * @param { string } currencyBase - The currency base avlue
   * @returns { Promise<import("./rate-provider").CurrencyRateMap> }
   */
  async map (data) {
    if (!data || data?.status === 'error') {
      logger.error('error to try map data to CurrencyRateMap')
      return {}
    }

    return {
      base: data.base,
      rateDate: new Date(data.timestamp),
      requestDate: new Date(),
      rates: new Map(Object.entries(data.rates))
    }
  }
}

module.exports = FixerRateProvider
