const assert = require('assert')

const InfoLog = require('./info-log')

describe('logger - info-log', () => {
  const bole = {}
  let logger = {}
  let outputLog

  beforeEach(() => {
    bole.info = (message, info) => {
      outputLog = `${message}#${JSON.stringify(info)}`
    }

    logger = new InfoLog(bole)
  })

  it('throws an Error when instantiates without the log engine reference', () => {
    assert.throws(() => new InfoLog(), Error)
  })

  it('returns the outputLog equals the parameters values', async () => {
    const expected = 'this is a log message#{"details":true}'

    await logger.log('this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })
})
