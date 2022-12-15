const router = require('express').Router()

const { buildConverterAction } = require('./gateway-controller')

function buildRoute (currenciesContainer, converter) {
  router.get('/convert/:currency/:value', buildConverterAction(currenciesContainer, converter))

  return router
}



module.exports = buildRoute
