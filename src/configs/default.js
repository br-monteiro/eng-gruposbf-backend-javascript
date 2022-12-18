const config = {
  rateProviders: {
    fixer: {
      baseUrl: 'http://localhost:3001/'
    },
    fake: {
      baseUrl: 'https://api.npoint.io/1ba6866e9c3737ae0613'
    }
  },
  cache: {
    host: 'redis',
    port: 6379,
    ttl: 300, // time in seconds
  }
}

module.exports = config
