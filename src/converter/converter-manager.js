const logger = require('../logger')('converter/converter')

class ConverterManager {
  STATUS_ERROR = 'error'
  STATUS_SUCCESS = 'success'

  #currenciesContainer
  #rateManager

  constructor (currenciesContainer, rateManager) {
    this.#currenciesContainer = currenciesContainer
    this.#rateManager = rateManager
  }

  #buildConvertResultObject(status) {
    return {
      status,
      rates: {}
    }
  }

  async #buildConvertResultMap(rates, value) {
    return rates.reduce((ratesMap, rate) => {
      const currency = this.#currenciesContainer.getCurrency(rate.origin)

      if (currency) {
        ratesMap.rates[rate.destination] = currency.convert(value, Number(rate.value))
      }

      return ratesMap
    }, this.#buildConvertResultObject(this.STATUS_SUCCESS))
  }

  async convert (currencyBase, value) {
    if (!this.#currenciesContainer.hasCurrency(currencyBase)) {
      logger.error(`the currency ${currencyBase} is not allowed to be converted`)

      return this.#buildConvertResultObject(this.STATUS_ERROR)
    }

    const rates = this.currenciesContainer.getAllIds()
      .reduce(async (accRates, id) => {
        if (id === currencyBase) return accRates
        accRates.push(this.#rateManager.getRate(currencyBase, id))
        return accRates
      }, [])

    return Promise.all(rates)
      .then(async (result) => await this.#buildConvertResultMap(result))
      .catch(error => {
        logger.error(`error to try convert ${currencyBase} ${value}`, error)
        return this.#buildConvertResultObject(this.STATUS_ERROR)
      })
  }
}

module.exports = ConverterManager
