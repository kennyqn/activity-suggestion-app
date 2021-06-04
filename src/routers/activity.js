const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Activity = require('../models/activity')

router.get('/activities', auth, async (req, res) => {
    try {
        const activities = await Activity.find()
        if (!activities) {
            throw new Error('Unable to retrieve activities')
        }
        res.send(activities)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router