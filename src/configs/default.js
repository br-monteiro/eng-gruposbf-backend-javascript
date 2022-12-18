const config = {
  rateProviders: {
    fixer: {
      baseUrl: 'http://localhost:3001/'
    }
  },
  cache: {
    host: 'redis',
    port: 6379,
    ttl: 300, // time in seconds
  }
}

module.exports = config
