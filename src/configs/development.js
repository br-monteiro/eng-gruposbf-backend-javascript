const config = {
  rateProviders: {
    fixer: {
      baseUrl: 'http://dev.myworkplace.com:3001/'
    }
  },
  cache: {
    host: 'localhost',
    port: 6379,
    ttl: 10, // time in seconds
  }
}

module.exports = config
