#!/usr/bin/env node

const app = require('./index')

const port = process.env.PORT || 3000

app.listen(port, async error => {
  if (error) {
    console.error('unable to listen for connections', error)
    process.exit(10)
  }

  console.info(`server is listening on port ${port}`)
})
