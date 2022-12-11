const assert = require('assert')

const ErrorLog = require('./error-log')

describe('logger - error-log', () => {
  const bole = {}
  let logger = {}
  let outputLog

  beforeEach(() => {
    bole.error = (message, info) => {
      outputLog = `${message}#${JSON.stringify(info)}`
    }

    logger = new ErrorLog(bole)
  })

  it('throws an Error when instantiates without the log engine reference', () => {
    assert.throws(() => new ErrorLog(), Error)
  })

  it('returns the outputLog equals the parameters values', async () => {
    const expected = 'this is a log message#{"details":true}'

    await logger.log('this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })
})
