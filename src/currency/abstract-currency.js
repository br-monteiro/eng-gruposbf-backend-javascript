class AbstractCurrency {
  #id

  constructor(id) {
    this.#id = this.#normalizeId(id)
  }

  #normalizeId(id) {
    if (!id || typeof id != 'string') {
      throw new Error('The ID value must be a valid string')
    }

    return id.toUpperCase()
  }

  getId() {
    return this.#id
  }

  convert(value, rate) {
    return value * rate
  }
}

module.exports = AbstractCurrency
