const axios = require("axios")

module.exports.runForecast = async (
  ctx,
  userId,
  FORECAST_URL,
  state,
  forecastFun,
  errorFun
) => {
  await axios
    .get(FORECAST_URL)
    .then((res) => {
      ctx.reply(forecastFun(res, state[userId].city))
    })
    .catch((err) => {
      ctx.reply(errorFun(err))
    })
}
