const CacheManager = require('./cache-manager')

class Redis extends CacheManager {
  #currenciesContainer
  #cache

  /**
   * @param { import("../currency/currencies-container") } currenciesContainer
   */
  constructor(cacheClient, currenciesContainer) {
    this.#currenciesContainer = currenciesContainer
    this.#cache = cacheClient
  }

  #buildCacheKey(currencyBase, currencyDestination) {
    return `${currencyBase.getId()}-${currencyDestination.getId()}`
  }

  async get(currencyBase, currencyDestination) {
    const cacheKey = this.#buildCacheKey(currencyBase, currencyDestination)
    return this.#cache.get(cacheKey)
  }

  /**
   * @param { import("../rate/rate-provider").CurrencyRateMap } currencyRateMap
   */
  async updateRates(currencyRateMap) {
    if (!currencyRateMap?.rates?.size) return

    this.#currenciesContainer
      .getAllIds()
      .forEach(id => {
        const cacheKey = `${currencyRateMap.base}-${id}`
        this.#cache.set(cacheKey, currencyRateMap.rates.get(id))
      })
  }
}

module.exports = Redis
