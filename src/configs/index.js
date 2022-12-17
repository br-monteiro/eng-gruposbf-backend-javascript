const mergician = require('mergician')
const defaultSettings = require('./default')
const devSettings = require('./development')
const prodSettings = require('./production')

const env = process.env.NODE_ENV || 'development'

/**
 * @param { string } env
 * @returns { Object }
 */
function mergeSettings (env) {
  const settings = env === 'production' ? prodSettings : devSettings

  return mergician(defaultSettings, settings)
}

module.exports = mergeSettings(env)
