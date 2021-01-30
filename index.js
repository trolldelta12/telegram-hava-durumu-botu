//Requirements
const axios = require("axios")
const weatherCalculator = require("./weatherCalculator.js")
const currentFun = require("./functions/current")
const errorFun = require("./functions/error")
const forecastFun = require("./functions/forecast.js")
const runForecast = require("./functions/runForecast").runForecast
const { Composer } = require("micro-bot")
const { checkCity } = require("./functions/checkCity")
var dailyInterval = null
//Texts
const welcomeText = require("./texts/welcome")
const bot = new Composer()
let state = {}
//Urls
var CURRENT_URL = weatherCalculator.currentUrl("")
var FORECAST_URL = weatherCalculator.forecastUrl("")

bot.start((ctx) => ctx.replyWithMarkdown(welcomeText))

//textListener
bot.on("text", (ctx, next) => {
  const userId = ctx.message.from.id
  if (state[userId]) {
    if (state[userId].command === "kaydet") {
      const userCity = ctx.message.text

      if (checkCity(userCity)) {
        state[userId].command = undefined
        state[userId].city = userCity
        CURRENT_URL = weatherCalculator.currentUrl(state[userId].city)
        FORECAST_URL = weatherCalculator.forecastUrl(state[userId].city)
        ctx.reply("Şehir Kaydedildi")
      } else {
        ctx.reply("Şehrin ismi yanlış. Tekrar dene")
      }
    } else {
      return next()
    }
  } else {
    return next()
  }
})

bot.help((ctx) => ctx.replyWithMarkdown(welcomeText))
bot.command("kaydet", (ctx) => {
  const userId = ctx.message.from.id
  if (!state[userId]) state[userId] = {}

  state[userId].command = "kaydet"
  return ctx.reply(
    `Kaydetmek istediğin şehrin ismini yaz (Eğer şehir Türkiye dışındansa İngilizce ismini yaz).`
  )
})
//Current
bot.command("anlikdurum", async (ctx) => {
  if (CURRENT_URL === "error") {
    ctx.reply("Şehri kaydetmemişşin. Şehri kaydet ve tekrar dene")
  } else {
    await axios
      .get(CURRENT_URL)
      .then((res) => {
        ctx.reply(currentFun(res))
      })
      .catch((err) => {
        ctx.reply(errorFun(err))
      })
  }
})

//Forecast
bot.command("yedigunluk", async (ctx) => {
  if (FORECAST_URL === "error") {
    ctx.reply("Şehri kaydetmemişşin. Şehri kaydet ve tekrar dene")
  } else {
    const userId = ctx.message.from.id
    await runForecast(ctx, userId, FORECAST_URL, state, forecastFun, errorFun)
  }
})

bot.command("gunlukhatirlatici", async (ctx) => {
  if (FORECAST_URL === "error") {
    ctx.reply("Şehri kaydetmemişşin. Şehri kaydet ve tekrar dene")
  } else {
    const userId = ctx.message.from.id

    if (state[userId].daily) {
      state[userId].daily = false
      ctx.reply("Günlük hava durumu kaldırıldı.")
      clearInterval(dailyInterval)
    } else {
      ctx.reply(
        "Tamamdır. Her gün aynı saatte haftalık hava durumu tahmini atılacak."
      )
      state[userId].daily = true
      dailyInterval = setInterval(
        async () =>
          await runForecast(
            ctx,
            userId,
            FORECAST_URL,
            state,
            forecastFun,
            errorFun
          ),
        86400000 //1 day
      )
    }
  }
})

module.exports = { bot, axios }
