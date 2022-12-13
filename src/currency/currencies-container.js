const AbstractCurrency = require('./abstract-currency')

class CurrenciesContainer {
  #currencies

  constructor() {
    this.#currencies = new Map()
  }

  setCurrency(currency) {
    if (!currency instanceof AbstractCurrency) {
      throw new Error('Currency must to be an AbstractCurrency implementation')
    }

    this.#currencies.set(currency.getId(), currency)

    return this
  }

  getCurrency(id) {
    return this.#currencies.get(id)
  }

  hasCurrency(id) {
    return this.#currencies.has(id)
  }

  getAllIds() {
    return Array.from(this.#currencies.keys())
  }
}

module.exports = CurrenciesContainer
