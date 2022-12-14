const logger = require('../logger')('rate/rate-manager')

class RateManager {
  #poolRateProviders
  #cacheManager

  /**
   * @param { Array<RateProvider> } poolRateProviders
   */
  constructor(poolRateProviders, cacheManager) {
    this.#poolRateProviders = poolRateProviders
    this.#cacheManager = cacheManager
  }

  async #getRateFromProvider(currencyBase, currencyDestination) {
    const providers = this.#poolRateProviders.map(async (provider) => {
      const result = await provider.fetch(currencyBase)
      return this.#poolRateProviders.map(result)
    })

    return Promise.any(providers)
      .then(async (result) => {
        const rateValue = result?.rates?.get(currencyDestination.getId()) || 0

        await this.#cacheManager.updateRates(result)
        return rateValue
      })
      .catch(error => {
        logger.error('error to get the rates from provider', error)
        return 0
      })
  }

  async getRate(currencyBase, currencyDestination) {
    return this.#cacheManager
            .get(currencyBase, currencyDestination)
            .then(result => {
              if (result.status !== null) {
                return result.value
              }

              return this.#getRateFromProvider(currencyBase, currencyDestination)
            })

  }
}

module.exports = RateManager
