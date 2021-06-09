const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const geocode = require("../utils/geocode.js");
const forecast = require("../utils/forecast.js");
const { DaysOfWeek } = require("../consts/consts")

// GET 7 day forecast
router.get("/weather", auth, async (req, res) => {
    try {
        address = req.query.address;
        if (!address) {
            return res.send({
                error: "Address is required",
            });
        }

        geocode(address, (error, { latitude, longitude } = {}) => {
            if (error) {
                return res.send({
                    error: error,
                });
            }
            forecast(
                latitude,
                longitude,
                false,
                async (error, forecastData) => {
                    if (error) {
                        return res.send({
                            error: error,
                        });
                    }

                    let weekForecast = [];
                    for (i = 0; i < forecastData.length; i++) {
                        let unix_timestamp = +forecastData[i].dt;
                        let date = new Date(unix_timestamp * 1000);
                        let dayOfWeek = DaysOfWeek[date.getDay()]
                        let dayOfMonth = date.getDate();
                        let month = date.getMonth() + 1;

                        const morningAvgTemp = forecastData[i].temp.morn;
                        const afternoonAvgTemp = forecastData[i].temp.day;
                        const eveningAvgTemp = forecastData[i].temp.eve;
                        const weatherConditions = forecastData[i].weather;
                        weekForecast.push({
                            id: i,
                            date: `${dayOfWeek} ${month}/${dayOfMonth}`,
                            morningAvgTemp,
                            afternoonAvgTemp,
                            eveningAvgTemp,
                            weatherConditions,
                        });
                    }

                    res.send({
                        weekForecast,
                    });
                }
            );
        });
    } catch (e) {
        res.status(500).send();
    }
});

// id === day 0-6 OR 'current'
router.get("/weather/:id", auth, async (req, res) => {
    const _id = req.params.id;
    wantCurrent = _id === "current";
    try {
        address = req.query.address;
        if (!address) {
            return res.send({
                error: "Address is required",
            });
        }

        geocode(address, (error, { latitude, longitude } = {}) => {
            if (error) {
                return res.send({
                    error: error,
                });
            }
            forecast(
                latitude,
                longitude,
                wantCurrent,
                async (error, forecastData) => {
                    if (error) {
                        return res.send({
                            error: error,
                        });
                    }
                    if (wantCurrent) {
                        let unix_timestamp = +forecastData.dt;
                        let date = new Date(unix_timestamp * 1000);
                        let dayOfWeek = DaysOfWeek[date.getDay()]
                        let dayOfMonth = date.getDate();
                        let month = date.getMonth() + 1;

                        const currentTemp = forecastData.temp;
                        const currentWeather = forecastData.weather;

                        res.send({
                            date: `${dayOfWeek} ${month}/${dayOfMonth}`,
                            currentTemp,
                            currentWeather,
                        });
                    } else {
                        let unix_timestamp = +forecastData[_id].dt;
                        let date = new Date(unix_timestamp * 1000);
                        let dayOfWeek = DaysOfWeek[date.getDay()]
                        let dayOfMonth = date.getDate();
                        let month = date.getMonth() + 1;

                        const morningAvgTemp = forecastData[_id].temp.morn;
                        const afternoonAvgTemp = forecastData[_id].temp.day;
                        const eveningAvgTemp = forecastData[_id].temp.eve;
                        const weatherConditions = forecastData[_id].weather;

                        res.send({
                            id: _id,
                            date: `${dayOfWeek} ${month}/${dayOfMonth}`,
                            morningAvgTemp,
                            afternoonAvgTemp,
                            eveningAvgTemp,
                            weatherConditions,
                        });
                    }
                }
            );
        });
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
