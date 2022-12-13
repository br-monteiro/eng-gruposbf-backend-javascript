const assert = require('assert')
const AbstractCurrency = require('./abstract-currency')

describe('currency - abstract-currency', () => {
  describe('#constructor', () =>{
    it('should throws an error when the constructor is called without an ID value', () => {
      assert.throws(() => new AbstractCurrency(), Error)
    })

    it('should throws an error when the constructor is called with invalid string', () => {
      assert.throws(() => new AbstractCurrency(''), Error)
    })

    it('should throws an error when the constructor is called with invalid not allowed value', () => {
      assert.throws(() => new AbstractCurrency(1), Error)
      assert.throws(() => new AbstractCurrency(true), Error)
      assert.throws(() => new AbstractCurrency({}), Error)
      assert.throws(() => new AbstractCurrency([]), Error)
    })
  })

  describe('#normalizeId', () => {
    it('should transform the value to upper case', () => {
      assert.strictEqual((new AbstractCurrency('brl')).getId(), 'BRL')
    })
  })

  describe('#convert', () => {
    it('should multiply de value according rate value', () => {
      const ac = new AbstractCurrency('BRL')
      const expected = 2.5

      assert.strictEqual(ac.convert(10, 0.25), expected)
    })
  })
})
