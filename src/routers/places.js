const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const geocode = require('../utils/geocode.js')
const searchForPlaces = require('../utils/search')
const Activity = require('../models/activity')
var cors = require('cors')
var app = express()
 
app.use(cors())

router.get('/places', auth, async (req, res) => {
    try {
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

        activity = req.query.activity;
        if (!activity) {
            return res.send({
                error: 'Activity is required'
            })
        }

        geocode(address, async (error, {
            latitude,
            longitude
        } = {}) => {
            if (error) {
                return res.send({
                    error: error
                })
            }

            let activityDetails = await Activity.findOne({key: activity})
            if (!activityDetails) {
                throw new Error()
            }
            let placeData = await searchForPlaces(activityDetails.searchQueries, {latitude, longitude}, searchRadius)

            res.send({
                activity,
                places: placeData
            })
            })
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router