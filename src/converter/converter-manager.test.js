require('../logger')('test').reset()

const assert = require('assert')
const sinon = require('sinon')
const AbstractCurrency = require('../currency/abstract-currency')
const ConverterManager = require('./converter-manager')
const CurrenciesContainer = require('../currency/currencies-container')
const RateManager = require('../rate/rate-manager')

describe('converter - converter-manager', () => {
  let currenciesContainer
  let rateManager
  /**
   * @type { ConverterManager }
   */
  let converterManager
  let poolRateProvidersMock
  let cacheManagerMock

  beforeEach(() => {
    currenciesContainer = new CurrenciesContainer()
    currenciesContainer.setCurrency(new AbstractCurrency('BRL'))
    currenciesContainer.setCurrency(new AbstractCurrency('USD'))

    poolRateProvidersMock = [
      new class {
        async fetch() {
          return Promise.resolve()
        }

        async map() {
          return Promise.resolve({
            base: 'BRL',
            rates: new Map([['BRL', 1], ['USD', 10]])
          })
        }
      }
    ]

    cacheManagerMock = new class {
      async get () {
        return Promise.resolve('5')
      }

      async updateRates () {
        return Promise.resolve()
      }
    }

    rateManager = new RateManager(poolRateProvidersMock, cacheManagerMock)
    converterManager = new ConverterManager(currenciesContainer, rateManager)
  })

  describe('#convert', () => {
    describe('convert a value according currencyBase', () => {
      context('using rates from cache', () => {
        it('should convert values using currency base as reference', async () => {
          const expected = {
            status: 'success',
            rates: {
              USD: 50
            }
          }

          const result = await converterManager.convert('BRL', 10)

          assert.deepStrictEqual(result, expected)
        })
      })

      context('using rates from provider api', () => {
        it('should convert values using currency base as reference', async () => {
          cacheManagerMock = new class {
            async get () {
              return Promise.resolve(null)
            }

            async updateRates () {
              return Promise.resolve()
            }
          }

          rateManager = new RateManager(poolRateProvidersMock, cacheManagerMock)
          converterManager = new ConverterManager(currenciesContainer, rateManager)

          const expected = {
            status: 'success',
            rates: {
              USD: 100
            }
          }

          const result = await converterManager.convert('BRL', 10)

          assert.deepStrictEqual(result, expected)
        })
      })
    })

    it('should returns ConvertResult with status error and empty object for rates when the currency is not allowed to be converted', async () => {
      const expected = {
        status: 'error',
        rates: {}
      }

      const result = await converterManager.convert('EDI', 10)

      assert.deepStrictEqual(result, expected)
    })

    it('should returns ConvertResult with status error and empty object for rates when something went wrong', async () => {
      const expected = {
        status: 'error',
        rates: {}
      }

      const stub = sinon.stub(rateManager, rateManager.getRate.name)
      stub.withArgs('BRL', 'USD').rejects()

      const result = await converterManager.convert('USD', 10)

      assert.deepStrictEqual(result, expected)
    })
  })
})
