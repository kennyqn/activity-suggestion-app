const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.openweathermap.org/data/2.5/onecall?units=imperial&exclude=minutely,hourly&appid=' + process.env.OPENWEATHER_API_KEY + '&lat=' + latitude + '&lon=' + longitude
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!')
        } else if (body.error) {
            callback('Unable to find location')
        } else {
            callback(undefined, body.daily)
        }
    })
}

module.exports = forecast