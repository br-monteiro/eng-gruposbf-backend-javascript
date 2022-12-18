const axios = require('axios')
const RateProvider = require('../rate-provider')
const logger = require('../../logger')('rate/fixer-rate-provider')

class FakeRateProvider extends RateProvider {
  constructor (baseUrl, apikey) {
    super(baseUrl, apikey)
  }

  /**
   * @param { string } currencyBase - The currency base value
   * @returns { Promise }
   */
  async fetch (currencyBase) {
    return axios.get(this.getBaseUrl(), {
      headers: {
        'Accept-Encoding': 'gzip,deflate,compress'
      }
    })
      .then(res => {
        logger.info(`get rates from FAKE provider for currency base ${currencyBase}`)
        res.data.base = currencyBase

        return res.data
      })
      .catch(error => {
        logger.error('error to try fetch the rates from FAKE API', error)
        return {
          status: this.STATUS_ERROR
        }
      })
  }

  /**
   * @param { string } currencyBase - The currency base avlue
   * @returns { Promise<import("../rate-provider").CurrencyRateMap> }
   */
  async resultAdapter (data) {
    if (
      !data ||
      data?.status === 'error' ||
      !data?.base ||
      !data?.timestamp ||
      !data?.rates
    ) {
      logger.error('error to try resultAdapter data to CurrencyRateMap from Fake API', { data })
      return Promise.reject({ data, test: 1 })
    }

    return {
      base: data.base,
      rateDate: new Date(data.timestamp),
      rates: new Map(Object.entries(data.rates))
    }
  }
}

module.exports = FakeRateProvider
