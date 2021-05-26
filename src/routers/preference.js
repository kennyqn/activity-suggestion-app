const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Preference = require('../models/preference')

router.post('/preferences', auth, async (req, res) => {
    const preference = new Preference({
        ...req.body,
        activity: req.body.activity.toLowerCase().replace(' ','_'),
        owner: req.user._id
    })
    try {
        await preference.save()
        res.status(201).send(preference)
    } catch (e) {
        res.status(400).send()
    }
})

// TODO: filtering
// GET /preferences?limit=10&skip=10 -- pagination (2nd set of 10 results)
// GET /preferences?sortBy=createdAt:desc -- sorting
router.get('/preferences', auth, async (req, res) => {
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]
    }

    try {
        // const preferences = await Preference.find({ owner: req.user._id }) // below line achieves same goal
        await req.user.populate({
            path: 'preferences',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate() 
        res.send(req.user.preferences)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/preferences/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const preference = await Preference.findOne({ _id, owner: req.user._id })
        if (!preference) {
            return res.status(404).send()
        }
        res.send(preference)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/preferences/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['minTemp', 'maxTemp', 'conditions', 'time']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid preference updates!'})
    }
    try {
        const preference = await Preference.findOne({ _id, owner: req.user._id })
        if (!preference) {
            return res.status(404).send()
        }
        updates.forEach((update) => preference[update] = req.body[update])
        await preference.save()
        res.send(preference)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/preferences/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const preference = await Preference.findOneAndDelete({ _id, owner: req.user._id })
        if (!preference) {
            return res.status(404).send()
        }
        res.send(preference)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router