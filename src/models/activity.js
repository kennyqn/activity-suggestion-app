const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    searchQueries: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    relatedActivities: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    backgroundImagePath: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true
})

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity