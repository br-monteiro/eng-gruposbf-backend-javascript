require('../logger')('test').reset()

const assert = require('assert')
const sinon = require('sinon')
const redis = require('redis')
const redisClient = require('../cache/redis-client')
const RateCacheManager = require('./rate-cache-manager')
const CurrenciesContainer = require('../currency/currencies-container')
const AbstractCurrency = require('../currency/abstract-currency')
const RateManager = require('./rate-manager')

describe('rate - rate-manager', () => {
  let rateManager
  let rateCacheManager
  let currenciesContainer
  let poolRateProvidersMock
  const sandbox = sinon.createSandbox()

  beforeEach(() => {
    const fakeFn = () => Promise.resolve()

    sinon
      .stub(redis, redis.createClient.name)
      .returns(Promise.resolve({
        on: fakeFn,
        connect: fakeFn,
        set: fakeFn
      }))

    sinon
      .stub(redisClient, 'get')
      .withArgs('BRL-USD')
      .resolves('5')
      .withArgs('BRL-EUR')
      .resolves(null)
      .withArgs('BRL-INR')
      .resolves(null)

    poolRateProvidersMock = [
      new class {
        async fetch () {
          return Promise.resolve()
        }

        async map () {
          return Promise.resolve({
            base: 'BRL',
            rates: new Map([['BRL', 1], ['USD', 10], ['EUR', 100]])
          })
        }
      }
    ]

    currenciesContainer = new CurrenciesContainer()
    currenciesContainer
      .setCurrency(new AbstractCurrency('BRL'))
      .setCurrency(new AbstractCurrency('USD'))

    sandbox.spy(currenciesContainer, currenciesContainer.getAllIds.name)
    sandbox.spy(redisClient, redisClient.set.name)

    rateCacheManager = new RateCacheManager(redisClient, currenciesContainer)
    rateManager = new RateManager(poolRateProvidersMock, rateCacheManager)

    sandbox.spy(rateCacheManager, rateCacheManager.updateRates.name)
  })

  afterEach(() => {
    redis.createClient.restore()
    redisClient.get.restore()
    sandbox.restore()
  })

  describe('#getRate', () => {
    describe('get the value of rates', () => {
      context('from cache', () => {
        it('should return the rate value according currencies passed by parameter', async () => {
          const expected = {
            origin: 'BRL',
            destination: 'USD',
            value: '5'
          }

          const result = await rateManager.getRate('BRL', 'USD')

          assert.deepStrictEqual(result, expected)
        })
      })

      context('from rate provider', () => {
        it('should returns the rate value according currencies passed by parameter', async () => {
          const expected = {
            origin: 'BRL',
            destination: 'EUR',
            value: 100
          }

          const result = await rateManager.getRate('BRL', 'EUR')

          assert.deepStrictEqual(result, expected)
          assert(rateCacheManager.updateRates.calledOnce)
        })
      })
    })

    it('should returns 0 when the currency is not allowed by rate provider', async () => {
      const expected = {
        origin: 'BRL',
        destination: 'INR',
        value: 0
      }

      const result = await rateManager.getRate('BRL', 'INR')

      assert.deepStrictEqual(result, expected)
      assert(rateCacheManager.updateRates.calledOnce)
    })

    it('should returns 0 when all providers fails', async () => {
      const expected = {
        origin: 'BRL',
        destination: 'EUR',
        value: 0
      }

      poolRateProvidersMock = [
        new class {
          async fetch () {
            return Promise.reject()
          }

          async map () {
            return Promise.reject()
          }
        },
        new class {
          async fetch () {
            return Promise.reject()
          }

          async map () {
            return Promise.reject()
          }
        }
      ]

      rateManager = new RateManager(poolRateProvidersMock, rateCacheManager)

      const result = await rateManager.getRate('BRL', 'EUR')

      assert.deepStrictEqual(result, expected)
      assert(rateCacheManager.updateRates.notCalled)
    })
  })
})
