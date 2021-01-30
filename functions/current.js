module.exports = (res) => {
  let city
  let temp
  let conditionText

  function result(obj) {
    return (
      obj.description.charAt(0).toUpperCase() +
      obj.description.slice(1).toLowerCase()
    )
  }
  try {
    city = res.data.name
    temp = parseInt(res.data.main.temp)
    res.data.weather.forEach((obj) => {
      conditionText = result(obj)
    })
  } catch (error) {
    console.error(error)
  }

  return `${city}\n${temp} Derece\n${conditionText}`
}
