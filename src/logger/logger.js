const bole = require('bole')
const fs = require('fs')

const DebugLog = require('./debug-log')
const InfoLog = require('./info-log')
const WarningLog = require('./warning-log')
const ErrorLog = require('./error-log')

bole.output([
  { level: 'debug', stream: fs.createWriteStream('app.log') },
  { level: 'info', stream: process.stdout }
])

class Logger {
  constructor (context) {
    if (!context || typeof context !== 'string') {
      throw new Error('The context of log is required')
    }

    this.setLogEngine(bole(context))
    this.setUp()
  }

  setLogEngine (logEngine) {
    if (!logEngine) {
      throw new Error('The log Engine is falsy')
    }
    /**
     * @type { import('bole') }
     */
    this.logEngine = logEngine

    return this
  }

  setUp () {
    this._debug = new DebugLog(this.logEngine)
    this._info = new InfoLog(this.logEngine)
    this._warning = new WarningLog(this.logEngine)
    this._error = new ErrorLog(this.logEngine)
  }

  /**
   * @param { string } message - The message of log
   * @param { Object } info - The object with more details about log
   */
  debug (message = '', info = {}) {
    this._debug.log(message, info)
  }

  /**
   * @param { string } message - The message of log
   * @param { Object } info - The object with more details about log
   */
  info (message = '', info = {}) {
    this._info.log(message, info)
  }

  /**
   * @param { string } message - The message of log
   * @param { Object } info - The object with more details about log
   */
  warning (message = '', info = {}) {
    this._warning.log(message, info)
  }

  /**
   * @param { string } message - The message of log
   * @param { Object } info - The object with more details about log
   */
  error (message = '', info = {}) {
    this._error.log(message, info)
  }

  reset () {
    return bole.reset()
  }
}

module.exports = Logger
