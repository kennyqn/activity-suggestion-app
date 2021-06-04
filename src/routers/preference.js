const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Preference = require('../models/preference')
const Activity = require('../models/activity')

router.post('/preferences', auth, async (req, res) => {
    let chosenActivityDocuments = [];
    let chosenActivities = [];
    if (req.query.activities) {
        chosenActivities = req.query.activities.split(',')
    } 

    try {
        if (chosenActivities.length > 0) {
            for (i = 0; i < chosenActivities.length; i++) {
                chosenActivityDocuments.push({
                    key: chosenActivities[i],
                    title: keyToTitle(chosenActivities[i]),
                    owner: req.user._id
                })
            }

            response = await Preference.insertMany(chosenActivityDocuments)
            return res.status(201).send(response)
        }

        let activityDetails = await Activity.findOne({key: req.body.title.toLowerCase().replace(' ','_')})
        const preference = new Preference({
            ...req.body,
            key: activityDetails.key,
            title: activityDetails.title,
            owner: req.user._id
        })
        await preference.save()
        res.status(201).send(preference)
    } catch (e) {
        console.log(e)
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

const keyToTitle = (key) => {
    const splitKey = key.split('_');
    upperCaseSplitKey = splitKey.map((word) => {
        return word[0].toUpperCase() + word.substring(1);
    })
    return upperCaseSplitKey.join(' ');
}

module.exports = router