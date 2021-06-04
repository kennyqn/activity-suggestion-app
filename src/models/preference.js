const mongoose = require('mongoose')

const preferenceSchema = new mongoose.Schema({
    activity: {
        type: String,
        required: true,
        trim: true
    },
    minTemp: {
        type: Number,
        required: true,
        default: function() {
            return 65;
        }
    },
    maxTemp: {
        type: Number,
        required: true,
        default: function() {
            return 75;
        }
    },
    conditions: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: function() {
            return {
                clear: true,
                snowing: true,
                rainy: true,
                cloudy: true
            }
        }
    },
    time: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: function() {
            return {
                morning: true,
                afternoon: true,
                evening: true
            }
        }
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