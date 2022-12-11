#!/usr/bin/env node

const app = require('./index')
const logger = require('./logger')('server')

const port = process.env.PORT || 3000

app.listen(port, async error => {
  if (error) {
    logger.error('unable to listen for connections', error)
    process.exit(10)
  }

  logger.info(`server is listening on port ${port}`)
})
