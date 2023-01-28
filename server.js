const app = require('./app')
const dotenv = require('dotenv')

dotenv.config({ path: './.env' })
const port = process.env.PORT

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})

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
