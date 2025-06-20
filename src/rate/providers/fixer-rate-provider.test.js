require('../../logger')('test').reset()

const assert = require('assert')
const sinon = require('sinon')
const axios = require('axios')
const FixerRateProvider = require('./fixer-rate-provider')

const BASE_URL = 'https://api.apilayer.com/fixer/latest'
const APIKEY = 'AÇAÍ-PURO'
const headers = {
  headers: {
    apikey: APIKEY,
    'Accept-Encoding': 'gzip,deflate,compress'
  }
}

describe('rate - providers - fixer-rate-provider', () => {
  let fixerProvider

  beforeEach(() => {
    fixerProvider = new FixerRateProvider(BASE_URL, APIKEY)
  })

  describe('#fetch', () => {
    afterEach(() => {
      axios.get.restore()
    })

    it('should perform a resquest to Fixer API and returns the rates details', async () => {
      sinon
        .stub(axios, 'get')
        .withArgs(`${BASE_URL}?base=BRL`, headers)
        .callsFake(() => Promise.resolve({
          data: {
            success: true,
            timestamp: 1670895842,
            base: 'BRL',
            date: '2022-12-13',
            rates: {
                USD: 4,
                BRL: 1,
                EUR: 5
            }
          }
        }))

      const expected = {
        success: true,
        timestamp: 1670895842,
        base: 'BRL',
        date: '2022-12-13',
        rates: {
            USD: 4,
            BRL: 1,
            EUR: 5
        }
      }

      const result = await fixerProvider.fetch('BRL')

      assert.deepStrictEqual(result, expected)
    })

    it('should returns an object with status error when api fails', async () => {
      const expected = {
        status: 'error'
      }

      sinon
      .stub(axios, 'get')
      .withArgs(`${BASE_URL}?base=BRL`, headers)
      .callsFake(() => Promise.reject({ message: 'fails' }))

      const result = await fixerProvider.fetch('BRL')

      assert.deepStrictEqual(result, expected)
    })
  })

  describe('#resultAdapter', () => {
    it('should returns a CurrencyRateMap object according data parameter', async () => {
      const data = {
        status: 'success',
        base: 'BRL',
        timestamp: 1670895842,
        rates: {
          BRL: 1,
          USD: 5
        }
      }

      const expected = {
        base: 'BRL',
        rateDate: new Date(1670895842),
        rates: new Map([['BRL', 1], ['USD', 5]])
      }

      assert.deepStrictEqual(await fixerProvider.resultAdapter(data), expected)
    })

    it('should returns an rejected promise when the data parameter is not valid', async () => {
      await fixerProvider
      .resultAdapter()
      .catch(err => assert.deepStrictEqual(err, undefined))

      await fixerProvider
      .resultAdapter({ status: 'error'})
      .catch(err => assert.deepStrictEqual(err, { status: 'error'}))

      await fixerProvider
      .resultAdapter({ status: 'success'})
      .catch(err => assert.deepStrictEqual(err, { status: 'success'}))

      await fixerProvider
      .resultAdapter({ status: 'success', base: 'BRL'})
      .catch(err => assert.deepStrictEqual(err, { status: 'success', base: 'BRL'}))

      await fixerProvider
      .resultAdapter({ status: 'success', base: 'BRL', timestamp: 1})
      .catch(err => assert.deepStrictEqual(err, { status: 'success', base: 'BRL', timestamp: 1}))
    })
  })
})
