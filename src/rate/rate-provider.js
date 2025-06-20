/**
 * @typedef CurrencyRateMap
 * @property { string } base
 * @property { Date } rateDate
 * @property { Map<string, number> } rates
 */

class RateProvider {
  STATUS_SUCCESS = 'success'
  STATUS_ERROR = 'error'

  constructor (baseUrl, apikey) {
    this.baseUrl = baseUrl
    this.apikey = apikey
  }

  async fetch (_currencyBase) {
    throw new Error('Method not implemented')
  }

  /**
   * @return { CurrencyRateMap }
   */
  async resultAdapter (_data) {
    throw new Error('Method not implemented')
  }

  /**
   * @returns { string }
   */
  getBaseUrl () {
    return this.baseUrl
  }

  /**
   * @returns { string }
   */
  getApikey () {
    return this.apikey
  }
}

module.exports = RateProvider
