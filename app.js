const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const userRoutes = require('./Routes/userRoutes')
const conversationRoutes = require('./Routes/conversationRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const socketIo = require('socket.io')
const http = require('http')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { decodeJWT } = require('./Utils/helpers')

const globalErrorHandler = require('./Controllers/errorController')

dotenv.config({ path: './.env' })
const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(cors())

const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

app.use(function (req, res, next) {
  req.io = io
  next()
})

// SOCKET

io.on('connection', async (socket) => {
  const currentUser = await decodeJWT(socket.handshake.auth.token, process.env.JWT_SECRET)
  if (currentUser.username) socket.join(currentUser.username)
  console.log(`client has connected, id: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log('A user has disconnected')
  })
})

// SWAGGER/OPEN API

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hermes-Chat Express API with Swagger',
      version: '0.1.0',
      description:
  'Real-time chat application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'Hermes-chat',
        url: 'https://hermes-chat.bogdanmilivojevic.com',
        email: 'info@email.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}`
      },
      {
        url: 'http://hermes-chat.bogdanmilivojevic.com'
      }
    ],
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer <JWT token here>'
        }
      }
    }
  },
  apis: ['./Routes/*.js']
}

app.use('/user', userRoutes)
app.use('/conversation', conversationRoutes)
app.use('/message', messageRoutes)
app.use(globalErrorHandler)

const specs = swaggerJsdoc(options)
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
)

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

// Unhandled errors
process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('UNHADLED REJECTION')
  server.close(() => {
    process.exit(1)
  })
})

process.on('uncaughtException', err => {
  console.log(err.name, err.message)
  console.log('UNCAUGHT EXCEPTION')
  server.close(() => {
    process.exit(1)
  })
})

module.exports = app
