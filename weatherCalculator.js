const { openWeatherToken } = require("./botToken")
const API_URL = "https://api.openweathermap.org/data/2.5/"
const API_TOKEN = openWeatherToken

const API_CURRENT = "weather"
const API_FORECAST = "onecall"
const API_LANGUAGE = "tr"

const cities = require("cities.json")

exports.currentUrl = (API_CITY) => {
  let city = cities.find((city) => {
    return city.name.toLowerCase() === API_CITY.toLowerCase()
  })

  if (city === undefined) {
    return "error"
  } else {
    return `${API_URL}${API_CURRENT}?q=${API_CITY}&appid=${API_TOKEN}&units=metric&lang=${API_LANGUAGE}`
  }
}
exports.forecastUrl = (API_CITY) => {
  let city = cities.find((city) => {
    return city.name.toLowerCase() === API_CITY.toLowerCase()
  })

  if (city === undefined) {
    return "error"
  } else {
    let API_CITY_LAT = city.lat
    let API_CITY_LON = city.lng
    return `${API_URL}${API_FORECAST}?lat=${API_CITY_LAT}&lon=${API_CITY_LON}&exclude=hourly,current,minutely,alerts&appid=${API_TOKEN}&lang=${API_LANGUAGE}&units=metric`
  }
}
