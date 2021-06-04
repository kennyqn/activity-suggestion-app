const express = require('express')

// doesn't pull anything from file -- used to connect to database when calling 'require'
require('./db/mongoose')
const userRouter = require('./routers/user')
const preferenceRouter = require('./routers/preference')
const weatherRouter = require('./routers/weather')
const suggestionRouter = require('./routers/suggestion')
const placesRouter = require('./routers/places')
const bookmarkRouter = require('./routers/bookmark')
const activityRouter = require('./routers/activity')

const app = express()

// automatically parse incoming json to an object to be accessed in request handlers
app.use(express.json())

// register user router
app.use(userRouter)

// register preference router
app.use(preferenceRouter)

// register weather router
app.use(weatherRouter)

// register suggestion router
app.use(suggestionRouter)

// register places router
app.use(placesRouter)

// register bookmark router
app.use(bookmarkRouter)

// register activity router
app.use(activityRouter)

module.exports = app