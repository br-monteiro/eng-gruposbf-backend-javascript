const axios = require('axios')
const RateProvider = require('../rate-provider')
const logger = require('../../logger')('rate/fixer-rate-provider')

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
    return axios.get(this.#buildUrl(currencyBase), {
      headers: {
        apikey: this.getApikey(),
        'Accept-Encoding': 'gzip,deflate,compress'
      }
    })
      .then(res => {
        logger.info(`get rates from FIXER provider for currency base ${currencyBase}`)
        return res.data
      })
      .catch(({ message }) => {
        logger.error('error to try fetch the rates from Fixer API', { message })
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
      logger.error('error to try resultAdapter data to CurrencyRateMap', { data })
      return {}
    }

    return {
      base: data.base,
      rateDate: new Date(data.timestamp),
      rates: new Map(Object.entries(data.rates))
    }
  }
}

module.exports = FixerRateProvider
