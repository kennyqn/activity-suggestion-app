const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Bookmark = require('../models/bookmark')

router.post('/bookmarks', auth, async (req, res) => {
    const bookmark = new Bookmark({
        ...req.body,
        owner: req.user._id
    })
    try {
        await bookmark.save()
        res.status(201).send(bookmark)
    } catch (e) {
        res.status(400).send()
    }
})

// TODO: filtering
// GET /bookmarks?limit=10&skip=10 -- pagination (2nd set of 10 results)
// GET /bookmarks?sortBy=createdAt:desc -- sorting
router.get('/bookmarks', auth, async (req, res) => {
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]
    }

    try {
        await req.user.populate({
            path: 'bookmarks',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate() 
        res.send(req.user.bookmarks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/bookmarks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const bookmark = await Bookmark.findOne({ _id, owner: req.user._id })
        if (!bookmark) {
            return res.status(404).send()
        }
        res.send(bookmark)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/bookmarks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const bookmark = await Bookmark.findOneAndDelete({ _id, owner: req.user._id })
        if (!bookmark) {
            return res.status(404).send()
        }
        res.send(bookmark)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router