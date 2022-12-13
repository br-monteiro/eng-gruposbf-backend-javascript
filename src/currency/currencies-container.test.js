const assert = require('assert')
const AbstractCurrency = require('./abstract-currency')
const CurrenciesContainer = require('./currencies-container')

describe('currency - currencies-container', () => {
  describe('#setCurrency', () => {
    it('should throws an error when try to set a currency that not implements AbstractCurrency', () => {
      const currency = new class {}
      const cc = new CurrenciesContainer()

      assert.throws(() => cc.setCurrency(currency), Error)
    })

    it('should not throws an error when try to set a currency that implements AbstractCurrency', () => {
      const currency = new class extends AbstractCurrency {
        constructor() {
          super('BRL')
        }
      }
      const cc = new CurrenciesContainer()

      assert.doesNotThrow(() => cc.setCurrency(currency), Error)
    })

    it('should set the currency on container map', () => {
      const brl = new class extends AbstractCurrency {
        constructor() {
          super('BRL')
        }
      }
      const usd = new class extends AbstractCurrency {
        constructor() {
          super('USD')
        }
      }
      const eur = new class extends AbstractCurrency {
        constructor() {
          super('EUR')
        }
      }

      const cc = new CurrenciesContainer()

      cc
        .setCurrency(brl)
        .setCurrency(usd)
        .setCurrency(eur)

      assert.deepStrictEqual(cc.getAllIds(), ['BRL', 'USD', 'EUR'])
      assert.deepStrictEqual(cc.getCurrency('BRL'), brl)
      assert.deepStrictEqual(cc.getCurrency('USD'), usd)
      assert.deepStrictEqual(cc.getCurrency('EUR'), eur)
    })
  })

  describe('#getCurrency', () => {
    it('should returns the currency object according ID', () => {
      const brl = new class extends AbstractCurrency {
        constructor() {
          super('BRL')
        }
      }

      const cc = new CurrenciesContainer()

      cc.setCurrency(brl)

      assert.deepStrictEqual(cc.getCurrency('BRL'), brl)
    })

    it('should returns undefined when there is no currency reference for the ID', () => {
      const cc = new CurrenciesContainer()

      assert.deepStrictEqual(cc.getCurrency('BRL'), undefined)
    })
  })

  describe('#hasCurrency', () => {
    it('should returns true when there is currency reference for the ID', () => {
      const brl = new class extends AbstractCurrency {
        constructor() {
          super('BRL')
        }
      }

      const cc = new CurrenciesContainer()

      cc.setCurrency(brl)

      assert.deepStrictEqual(cc.hasCurrency('BRL'), true)
    })

    it('should returns false when there is no currency reference for the ID', () => {
      const cc = new CurrenciesContainer()

      assert.deepStrictEqual(cc.hasCurrency('BRL'), false)
    })
  })

  describe('#getAllIds', () => {
    it('should returns an array with all currencies id', () => {
      const brl = new class extends AbstractCurrency {
        constructor() {
          super('BRL')
        }
      }
      const usd = new class extends AbstractCurrency {
        constructor() {
          super('USD')
        }
      }
      const eur = new class extends AbstractCurrency {
        constructor() {
          super('EUR')
        }
      }

      const cc = new CurrenciesContainer()

      cc
        .setCurrency(brl)
        .setCurrency(usd)
        .setCurrency(eur)

      assert.deepStrictEqual(cc.getAllIds(), ['BRL', 'USD', 'EUR'])
    })

    it('should returns an empty array when there is no currencies into container', () => {
      const cc = new CurrenciesContainer()

      assert.deepStrictEqual(cc.getAllIds(), [])
    })
  })
})
