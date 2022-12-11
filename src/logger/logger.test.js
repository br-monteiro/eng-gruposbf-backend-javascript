const assert = require('assert')

const Logger = require('./logger')

describe('logger - logger', () => {
  const bole = {}
  let logger = {}
  let outputLog = ''

  beforeEach(() => {
    const common = (message, info) => `#${message}#${JSON.stringify(info)}`

    bole.debug = (message, info) => {
      outputLog = `debug${common(message, info)}`
    }

    bole.info = (message, info) => {
      outputLog = `info${common(message, info)}`
    }

    bole.warn = (message, info) => {
      outputLog = `warning${common(message, info)}`
    }

    bole.error = (message, info) => {
      outputLog = `error${common(message, info)}`
    }

    logger = new Logger('test')
    logger.setLogEngine(bole).setUp()
  })

  it('throws an Error when instantiates without the context', () => {
    assert.throws(() => new Logger(), Error)
  })

  it('returns the outputLog for log type "debug"', async () => {
    const expected = 'debug#this is a log message#{"details":true}'

    await logger.debug('this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })

  it('returns the outputLog for log type "info"', async () => {
    const expected = 'info#this is a log message#{"details":true}'

    await logger.info('this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })

  it('returns the outputLog for log type "warning"', async () => {
    const expected = 'warning#this is a log message#{"details":true}'

    await logger.warning('this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })

  it('returns the outputLog for log type "error"', async () => {
    const expected = 'error#this is a log message#{"details":true}'

    await logger.error('this is a log message', { details: true })

    assert.strictEqual(outputLog, expected)
  })
})
