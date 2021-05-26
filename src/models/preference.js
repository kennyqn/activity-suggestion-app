const mongoose = require('mongoose')

const preferenceSchema = new mongoose.Schema({
    activity: {
        type: String,
        required: true,
        trim: true
    },
    minTemp: {
        type: Number,
        required: true
    },
    maxTemp: {
        type: Number,
        required: true
    },
    conditions: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    time: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Preference = mongoose.model('Preference', preferenceSchema)

module.exports = Preference