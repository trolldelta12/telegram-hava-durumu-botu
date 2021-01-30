const monthFun = (monthNum) => {
  if (monthNum < 10) {
    return `0${monthNum}`
  } else {
    return `${monthNum}`
  }
}

const dayFun = (dayNum) => {
  if (dayNum < 10) {
    return `0${dayNum}`
  } else {
    return `${dayNum}`
  }
}

function resultEditedText(description) {
  return (
    description.charAt(0).toUpperCase() + description.slice(1).toLowerCase()
  )
}

const resultFun = (result) => {
  let date = new Date(result.dt * 1000)
  let month = monthFun(date.getMonth() + 1)
  let day = dayFun(date.getDate())

  let maxTemp = parseInt(result.temp.max)
  let minTemp = parseInt(result.temp.min)

  let conditionText = resultEditedText(result.weather.shift().description)

  return `${day}/${month}    ${conditionText}    ${minTemp}/${maxTemp}\n\n`
}

module.exports = (res, cityName) => {
  let city = resultEditedText(cityName)
  var textResult = `${city}\n`

  let text = []
  let forecastDay = res.data.daily

  forecastDay.forEach((result) => {
    let resultText = resultFun(result)
    text.push(resultText)
  })

  text.forEach((txt) => {
    textResult = textResult + txt
  })

  return textResult
}
