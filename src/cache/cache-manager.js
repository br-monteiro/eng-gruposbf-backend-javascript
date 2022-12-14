class CacheManager {
  async get(_currencyBase, _currencyDestination) {
    throw new Error('Method not implemented')
  }

  /**
   * @param { import("../rate/rate-provider").CurrencyRateMap } _currencyRateMap
   */
  async updateRates(_currencyRateMap) {
    throw new Error('Method not implemented')
  }
}

module.exports = CacheManager
