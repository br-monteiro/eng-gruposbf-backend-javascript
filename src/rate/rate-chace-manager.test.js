require('../logger')('test').reset()

const assert = require('assert')
const sinon = require('sinon')
const redis = require('redis')
const redisClient = require('../cache/redis-client')
const RateCacheManager = require('./rate-cache-manager')
const CurrenciesContainer = require('../currency/currencies-container')
const AbstractCurrency = require('../currency/abstract-currency')

describe('rate - rate-cache-manager', () => {
  let rateCacheManager
  let currenciesContainer
  const sandbox = sinon.createSandbox()

  beforeEach(() => {
    const fakeFn = () => Promise.resolve()

    sinon
      .stub(redis, redis.createClient.name)
      .returns(Promise.resolve({
        on: fakeFn,
        connect: fakeFn
      }))

    sinon
      .stub(redisClient, 'get')
      .withArgs('BRL-USD')
      .resolves('5')
      .withArgs('BRL-EUR')
      .resolves(null)

    currenciesContainer = new CurrenciesContainer()
    currenciesContainer
      .setCurrency(new AbstractCurrency('BRL'))
      .setCurrency(new AbstractCurrency('USD'))

    sandbox.spy(currenciesContainer, currenciesContainer.getAllIds.name)
    sandbox.spy(redisClient, redisClient.set.name)

    rateCacheManager = new RateCacheManager(redisClient, currenciesContainer)
  })

  afterEach(() => {
    redis.createClient.restore()
    redisClient.get.restore()
    sandbox.restore()
  })

  describe('#get', async () => {
    it('should resturns the rate value according currency base and currency destination', async () => {
      assert.strictEqual(await rateCacheManager.get('BRL', 'USD'), '5')
    })

    it('should resturns null when the currency does not exist on cache', async () => {
      assert.strictEqual(await rateCacheManager.get('BRL', 'EUR'), null)
    })
  })

  describe('#updateRates', () => {
    it('should try to insert the rates value into cache', async () => {
      await rateCacheManager.updateRates({
        base: 'BRL',
        rates: new Map([['BRL', 1], ['USD', 5]])
      })

      const [callOne, callTwo] = redisClient.set.args

      assert(currenciesContainer.getAllIds.calledOnce)
      assert(redisClient.set.calledTwice)
      assert.deepStrictEqual(callOne, ['BRL-BRL', 1])
      assert.deepStrictEqual(callTwo, ['BRL-USD', 5])
    })
  })
})
