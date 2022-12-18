const config = {
  rateProviders: {
    fixer: {
      baseUrl: 'https://api.apilayer.com/fixer/latest'
    }
  },
  cache: {
    host: 'localhost',
    port: 6379,
    ttl: 300, // time in seconds | 5 minutes
  }
}

module.exports = config
