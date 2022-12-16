const logger = require('../logger')('gateway-api/gateway-api-controller')

const RESULT_STATUS_ERROR = 'error'

function buildConverterAction (currenciesContainer, converter) {
  return async function (req, res) {
    const { currency, value } = req.params
    const currencyValue = Number(value)

    if (!currenciesContainer.hasCurrency(currency)) {
      logger.error(`the currency ${currency} is not allowed to be converted`)

      return res.status(404).send({
        status: RESULT_STATUS_ERROR,
        message: `the currency ${currency} is not allowed to be converted`
      })
    }

    if (isNaN(currencyValue)) {
      logger.error(`the value "${req.params.value}" is not a number`)

      return res.status(400).send({
        status: RESULT_STATUS_ERROR,
        message: `the value "${req.params.value}" is not a number`
      })
    }

    const { rates, status } = await converter.convert(currency, value)

    if (status === converter.STATUS_ERROR) {
      logger.error(`error to try convert ${currency} ${value}`)

      return res.status(500).send({
        status: RESULT_STATUS_ERROR,
        message: 'something went wrong =/'
      })
    }

    res.send({ status, rates })
  }
}

module.exports = {
  buildConverterAction
}
