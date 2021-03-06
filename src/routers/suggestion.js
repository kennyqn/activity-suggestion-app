const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const geocode = require('../utils/geocode.js')
const forecast = require('../utils/forecast.js')
const { HazardousConditions, DaysOfWeek } = require('../consts/consts');
const Activity = require('../models/activity')
var cors = require('cors')
var app = express()
 
app.use(cors())

// GET 7 day suggestions
router.get('/suggestions', auth, async (req, res) => {
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
                try {
                    let weekActivitySuggestions = [];
                    for (i = 0; i < 7; i++) {
                        let suggestedActivities_MORNING = [];
                        let suggestedActivities_AFTERNOON = [];
                        let suggestedActivities_EVENING = [];
    
                        let unix_timestamp = +forecastData[i].dt
                        let date = new Date(unix_timestamp * 1000);
                        let dayOfWeek = DaysOfWeek[date.getDay()]
                        let dayOfMonth = date.getDate();
                        let month = date.getMonth() + 1;
    
                        const morningAvgTemp = forecastData[i].temp.morn;
                        const afternoonAvgTemp = forecastData[i].temp.day;
                        const eveningAvgTemp = forecastData[i].temp.eve;
    
                        const weatherConditions = forecastData[i].weather;
                        const preferredWeatherConditions = req.user.preferences.conditions;
                        for (j = 0; j < req.user.preferences.length; j++) {
                            const prefMinTemp = req.user.preferences[j].minTemp;
                            const prefMaxTemp = req.user.preferences[j].maxTemp;
                            const activity = req.user.preferences[j].key;
                            let activityDetails = await Activity.findOne({key: activity})

                            if (!activityDetails) {
                                throw new Error('Unable to retrieve activity details')
                            }
                            if (req.user.preferences[j].time.morning) {
                                if (isSuggestedActivity(prefMinTemp, prefMaxTemp, morningAvgTemp, preferredWeatherConditions, weatherConditions)) {
                                    suggestedActivities_MORNING.push({
                                        key: activity,
                                        title: activityDetails.title,
                                        backgroundImagePath: activityDetails.backgroundImagePath
                                    })
                                }
                            }
                            if (req.user.preferences[j].time.afternoon) {
                                if (isSuggestedActivity(prefMinTemp, prefMaxTemp, afternoonAvgTemp, preferredWeatherConditions, weatherConditions)) {
                                    suggestedActivities_AFTERNOON.push({
                                        key: activity,
                                        title: activityDetails.title,
                                        backgroundImagePath: activityDetails.backgroundImagePath
                                    })
                                }
                            }
                            if (req.user.preferences[j].time.evening) {
                                if (isSuggestedActivity(prefMinTemp, prefMaxTemp, eveningAvgTemp, preferredWeatherConditions, weatherConditions)) {
                                    suggestedActivities_EVENING.push({
                                        key: activity,
                                        title: activityDetails.title,
                                        backgroundImagePath: activityDetails.backgroundImagePath
                                    })
                                }
                            }
                        }
                        weekActivitySuggestions.push({
                            id: i,
                            date: `${dayOfWeek} ${month}/${dayOfMonth}`,
                            morningSuggestions: suggestedActivities_MORNING,
                            afternoonSuggestions: suggestedActivities_AFTERNOON,
                            eveningSuggestions: suggestedActivities_EVENING
                        })
                    }
                    res.send(weekActivitySuggestions)
                } catch (e) {
                    res.status(500).send()
                }
            })
        })
    } catch (e) {
        res.status(500).send()
    }
})

// id === day 0-6
router.get('/suggestions/:id', auth, async (req, res) => {
    const _id = req.params.id

    let suggestedActivities_MORNING = [];
    let suggestedActivities_AFTERNOON = [];
    let suggestedActivities_EVENING = [];

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
                try {
                    const morningAvgTemp = forecastData[_id].temp.morn;
                    const afternoonAvgTemp = forecastData[_id].temp.day;
                    const eveningAvgTemp = forecastData[_id].temp.eve;
    
                    const weatherConditions = forecastData[_id].weather;
                    const preferredWeatherConditions = req.user.preferences.conditions;
                    for (i = 0; i < req.user.preferences.length; i++) {
                        const prefMinTemp = req.user.preferences[i].minTemp;
                        const prefMaxTemp = req.user.preferences[i].maxTemp;
                        const activity = req.user.preferences[i].key;
                        let activityDetails = await Activity.findOne({key: activity})
                        if (!activityDetails)  {
                            throw new Error('Unable to retrieve activity details')
                        }
                        if (req.user.preferences[i].time.morning) {
                            if (isSuggestedActivity(prefMinTemp, prefMaxTemp, morningAvgTemp, preferredWeatherConditions, weatherConditions)) {
                                suggestedActivities_MORNING.push({
                                    key: activity,
                                    title: activityDetails.title,
                                    backgroundImagePath: activityDetails.backgroundImagePath
                                })
                            }
                        }
                        if (req.user.preferences[i].time.afternoon) {
                            if (isSuggestedActivity(prefMinTemp, prefMaxTemp, afternoonAvgTemp, preferredWeatherConditions, weatherConditions)) {
                                suggestedActivities_AFTERNOON.push({
                                    key: activity,
                                    title: activityDetails.title,
                                    backgroundImagePath: activityDetails.backgroundImagePath
                                })
                            }
                        }
                        if (req.user.preferences[i].time.evening) {
                            if (isSuggestedActivity(prefMinTemp, prefMaxTemp, eveningAvgTemp, preferredWeatherConditions, weatherConditions)) {
                                suggestedActivities_EVENING.push({
                                    key: activity,
                                    title: activityDetails.title,
                                    backgroundImagePath: activityDetails.backgroundImagePath
                                })
                            }
                        }
                    }
                    res.send({
                        morningSuggestions: suggestedActivities_MORNING,
                        afternoonSuggestions: suggestedActivities_AFTERNOON,
                        eveningSuggestions: suggestedActivities_EVENING
                    })
                } catch (e) {
                    res.status(500).send(e)
                }

            })
        })
    } catch (e) {
        res.status(500).send()
    }
})

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