const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const geocode = require('../utils/geocode.js')
const forecast = require('../utils/forecast.js')
const searchForPlaces = require('../utils/search')
const {
    ActivitySearchQueries,
    HazardousConditions
} = require('../consts/consts');

let suggestedActivities_MORNING = [];
let suggestedActivities_AFTERNOON = [];
let suggestedActivities_EVENING = [];

// id === day 0-6
router.get('/suggestions/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        await req.user.populate({
            path: 'preferences'
        }).execPopulate()

        address = req.query.address
        if (!address) {
            return res.send({
                error: 'Address is required'
            })
        }

        searchRadius = req.query.radius;
        if (!searchRadius) {
            searchRadius = '48280.3' // 30 miles in meters (default)
        }
        geocode(address, (error, {
            latitude,
            longitude
        } = {}) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
            forecast(latitude, longitude, async (error, forecastData) => {
                if (error) {
                    return res.send({
                        error: error
                    })
                }

                const morningAvgTemp = forecastData[_id].temp.morn;
                const afternoonAvgTemp = forecastData[_id].temp.day;
                const eveningAvgTemp = forecastData[_id].temp.eve;

                const weatherConditions = forecastData[_id].weather;
                const preferredWeatherConditions = req.user.preferences.conditions;
                for (i = 0; i < req.user.preferences.length; i++) {
                    await recommendedPlaces(req.user.preferences[i], {latitude, longitude}, searchRadius, preferredWeatherConditions, {morningAvgTemp, afternoonAvgTemp, eveningAvgTemp, weatherConditions}, req.user.preferences[i].activity)
                }
                res.send({
                    morningAvgTemp,
                    afternoonAvgTemp,
                    eveningAvgTemp,
                    weatherConditions,
                    morningSuggestions: suggestedActivities_MORNING,
                    afternoonSuggestions: suggestedActivities_AFTERNOON,
                    eveningSuggestions: suggestedActivities_EVENING
                })
            })
        })
    } catch (e) {
        res.status(500).send()
    }
})

const recommendedPlaces = async (preferences, location, searchRadius, preferredWeatherConditions, weather, activity) => {
    const prefMinTemp = preferences.minTemp;
    const prefMaxTemp = preferences.maxTemp;
    const {latitude, longitude} = location;
    const {morningAvgTemp, afternoonAvgTemp, eveningAvgTemp, weatherConditions} = weather;

    if (preferences.time.morning) {
        if (isSuggestedActivity(prefMinTemp, prefMaxTemp, morningAvgTemp, preferredWeatherConditions, weatherConditions)) {
            let placeData = await searchForPlaces(ActivitySearchQueries.get(activity), {latitude, longitude}, searchRadius)
            if (!placeData) {
                return ({
                    error: 'Unable to retrieve place suggestions'
                })
            }
            suggestedActivities_MORNING.push({
                activity,
                results: placeData
            })
        }
    }
    if (preferences.time.afternoon) {
        if (isSuggestedActivity(prefMinTemp, prefMaxTemp, afternoonAvgTemp, preferredWeatherConditions, weatherConditions)) {
            let placeData = await searchForPlaces(ActivitySearchQueries.get(activity), {latitude, longitude}, searchRadius)
            if (!placeData) {
                return ({
                    error: 'Unable to retrieve place suggestions'
                })
            }
            suggestedActivities_AFTERNOON.push({
                activity,
                results: placeData
            })
        }

    }
    if (preferences.time.evening) {
        if (isSuggestedActivity(prefMinTemp, prefMaxTemp, eveningAvgTemp, preferredWeatherConditions, weatherConditions)) {
            let placeData = await searchForPlaces(ActivitySearchQueries.get(activity), {latitude, longitude}, searchRadius)
            if (!placeData) {
                return ({
                    error: 'Unable to retrieve place suggestions'
                })
            }
            suggestedActivities_EVENING.push({
                activity,
                results: placeData
            })

        }

    }
}

const isSuggestedActivity = (min, max, temp, preferredWeatherConditions, weatherConditions) => {
    if (isPreferredTemp(min, max, temp) && isPreferredConditions(weatherConditions[i], preferredWeatherConditions)) {
        return true
    }
    return false
}

const isPreferredTemp = (min, max, temp) => {
    if (temp >= min && temp <= max) {
        return true
    }
    return false
}

const isPreferredConditions = (weatherConditions, preferences) => {
    if (!weatherConditions) {
        return true;
    }
    for (i = 0; i < weatherConditions.length; i++) {
        if (HazardousConditions.includes(conditions[i].main)) {
            return false
        }
        if (!preferences.raining && (conditions[i].main === 'Rain' || conditions[i].main === 'Drizzle')) {
            return false
        }
        if (!preferences.snowing && conditions[i].main === 'Snow') {
            return false
        }
        if (!preferences.cloudy && conditions[i].main === 'Clouds') {
            return false
        }
        if (!preferences.clear && conditions[i].main === 'Clear') {
            return false
        }
    }
    return true
}

module.exports = router