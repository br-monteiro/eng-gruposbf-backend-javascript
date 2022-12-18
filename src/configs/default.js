const config = {
  rateProviders: {
    fixer: {
      baseUrl: 'https://api.apilayer.com/fixer/latest'
    }
  },
  cache: {
    host: 'redis',
    port: 6379,
    ttl: 300, // time in seconds
  }
}

module.exports = config
