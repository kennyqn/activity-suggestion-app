const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const geocode = require("../utils/geocode.js");
const forecast = require("../utils/forecast.js");

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
                async (error, forecastData) => {
                    if (error) {
                        return res.send({
                            error: error,
                        });
                    }

                    let weekForecast = [];
                    for (i = 0; i < 7; i++) {
                        let unix_timestamp = +forecastData[i].dt;
                        let date = new Date(unix_timestamp * 1000);
                        let dayOfWeek = date.getDay();

                        const morningAvgTemp = Math.round(
                            forecastData[i].temp.morn
                        );
                        const afternoonAvgTemp = Math.round(
                            forecastData[i].temp.day
                        );
                        const eveningAvgTemp = Math.round(
                            forecastData[i].temp.eve
                        );
                        const minTemp = Math.round(forecastData[i].temp.min);
                        const maxTemp = Math.round(forecastData[i].temp.max);
                        const weatherConditions = forecastData[i].weather;
                        weekForecast.push({
                            id: i,
                            dayOfWeek,
                            morningAvgTemp,
                            afternoonAvgTemp,
                            eveningAvgTemp,
                            minTemp,
                            maxTemp,
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

// id === day 0-6 -- if day 0 (today), then we also get the current temp
router.get("/weather/:id", auth, async (req, res) => {
    const _id = req.params.id;
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
                async (error, forecastData) => {
                    if (error) {
                        return res.send({
                            error: error,
                        });
                    }

                    let unix_timestamp = +forecastData[_id].dt;
                    let date = new Date(unix_timestamp * 1000);
                    let dayOfWeek = date.getDay();

                    const morningAvgTemp = Math.round(
                        forecastData[_id].temp.morn
                    );
                    const afternoonAvgTemp = Math.round(
                        forecastData[_id].temp.day
                    );
                    const eveningAvgTemp = Math.round(
                        forecastData[_id].temp.eve
                    );
                    const minTemp = Math.round(forecastData[_id].temp.min);
                    const maxTemp = Math.round(forecastData[_id].temp.max);
                    const weatherConditions = forecastData[_id].weather;

                    if (_id === '0') {
                        res.send({
                            id: _id,
                            dayOfWeek,
                            currentTemp: Math.round(forecastData.currentTemp),
                            morningAvgTemp,
                            afternoonAvgTemp,
                            eveningAvgTemp,
                            minTemp,
                            maxTemp,
                            weatherConditions,
                        });
                    } else {
                        res.send({
                            id: _id,
                            dayOfWeek,
                            morningAvgTemp,
                            afternoonAvgTemp,
                            eveningAvgTemp,
                            minTemp,
                            maxTemp,
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
