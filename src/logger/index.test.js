const assert = require('assert')
const loggerFactory = require('./index')

describe('logger - index', () => {
  it('when instaciates the logger returns a instance of Logger', () => {
    const log = loggerFactory('test')
    assert.strictEqual('Logger', log.constructor.name)
  })

  it('throw a Error when try to instantiate without context parameter', () => {
    assert.throws(() => loggerFactory(), Error)
  })
})
