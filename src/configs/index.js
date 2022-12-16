const defaultSettings = require('./default')
const mergician = require('mergician')

const env = process.env.NODE_ENV || 'development'

function mergeSettings (env) {
  let settings = {}

  if (env === 'development') {
    settings = require('./development')
  }

  if (env === 'production') {
    settings = require('./production')
  }

  return mergician(defaultSettings, settings)
}

module.exports = mergeSettings(env)
