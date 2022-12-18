const logger = require('../logger')('chache/redis-client')
const { cache } = require('../configs')
const { createClient } = require('redis')

const client = createClient({
  socket: {
    port: cache.port,
    host: cache.host
  }
})

client.on('error', (error) => logger.error('redis client error', error))
client
  .connect()
  .then(() => logger.info('redis connected successfully'))
  .catch(() => logger.error('error to try connect with redis'))

function get (key) {
  return client.get(key)
}

function set (key, value) {
  return client.set(key, value, {
    EX: cache.ttl
  })
}

module.exports = {
  client,
  get,
  set
}
