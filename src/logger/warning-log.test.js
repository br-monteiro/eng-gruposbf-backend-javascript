const assert = require('assert')

const WarningLog = require('./warning-log')

describe('logger - warning-log', () => {
  const bole = {}
  let logger = {}
  let outputLog

  beforeEach(() => {
    bole.warn = (message, info) => {
      outputLog = `${message}#${JSON.stringify(info)}`
    }

    logger = new WarningLog(bole)
  })

  it('throws an Error when instantiates without the log engine reference', () => {
    assert.throws(() => new WarningLog(), Error)
  })

  it('returns the outputLog equals the parameters values', async () => {
    const expected = 'this is a log message#{"details":true}'

    await logger.log('this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })
})
