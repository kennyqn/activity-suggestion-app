const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema({
    activity: {
        type: String,
        required: true,
        trim: true
    },
    placeData: {
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

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)

module.exports = Bookmark