const logger = require('../logger')('converter/converter')

/**
 * @typedef ConvertResult
 * @property { string } status
 * @property { Object.<string, string> } rates
 */
class ConverterManager {
  STATUS_ERROR = 'error'
  STATUS_SUCCESS = 'success'

  #currenciesContainer
  #rateManager

  /**
   * @param { CurrenciesContainer } currenciesContainer
   * @param { RateCacheManager } rateManager
   */
  constructor (currenciesContainer, rateManager) {
    this.#currenciesContainer = currenciesContainer
    this.#rateManager = rateManager
  }

  /**
   * @param { string } status
   * @returns { ConvertResult }
   */
  #buildConvertResultObject (status) {
    return {
      status,
      rates: {}
    }
  }

  /**
   * @param { Array<RateValue> } rates
   * @param { number } value
   * @returns { ConvertResult }
   */
  async #buildConvertResultMap (rates, value) {
    return rates.reduce((ratesMap, rate) => {
      const currency = this.#currenciesContainer.getCurrency(rate.origin)

      if (currency) {
        ratesMap.rates[rate.destination] = currency.convert(value, Number(rate.value))
      }

      return ratesMap
    }, this.#buildConvertResultObject(this.STATUS_SUCCESS))
  }

  /**
   * @param { string } currencyBase
   * @param { number } value
   * @returns { ConvertResult }
   */
  async convert (currencyBase, value) {
    if (!this.#currenciesContainer.hasCurrency(currencyBase)) {
      logger.error(`the currency ${currencyBase} is not allowed to be converted`)

      return this.#buildConvertResultObject(this.STATUS_ERROR)
    }

    // perform the first request to populate the cache
    await this.#rateManager.getRate(currencyBase, currencyBase)

    const rates = this.#currenciesContainer.getAllIds()
      .reduce((accRates, id) => {
        if (id === currencyBase) return accRates
        accRates.push(this.#rateManager.getRate(currencyBase, id))
        return accRates
      }, [])

    return Promise.all(rates)
      .then(async (result) => await this.#buildConvertResultMap(result, value))
      .catch(error => {
        logger.error(`error to try convert ${currencyBase} ${value}`, error)
        return this.#buildConvertResultObject(this.STATUS_ERROR)
      })
  }
}

module.exports = ConverterManager
