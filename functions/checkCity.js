const cities = require("cities.json")

module.exports.checkCity = (city) => {
  const result = cities.find((cty) => {
    return cty.name.toLowerCase() === city.toLowerCase()
  })

  return Boolean(result)
}
