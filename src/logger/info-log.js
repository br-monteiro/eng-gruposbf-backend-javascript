class InfoLog {
  constructor (boleReference) {
    if (!boleReference) throw new Error('The log engine is required')

    /**
     * @type { import('bole') }
     */
    this.bole = boleReference
  }

  /**
   * @param { string } message - The message of log
   * @param { Object } info - The object with more details about log
   */
  async log (message = '', info = {}) {
    this.bole.info(message, info)
  }
}

module.exports = InfoLog
