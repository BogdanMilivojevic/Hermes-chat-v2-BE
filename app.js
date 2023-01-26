const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const userRoutes = require('./Routes/userRoutes')
const conversationRoutes = require('./Routes/conversationRoutes')
const messageRoutes = require('./Routes/messageRoutes')

const globalErrorHandler = require('./Controllers/errorController')

dotenv.config({ path: './.env' })

const app = express()

app.use(express.json())
app.use(cors())

app.use('/user', userRoutes)
app.use('/conversation', conversationRoutes)
app.use('/message', messageRoutes)
app.use(globalErrorHandler)

module.exports = app
