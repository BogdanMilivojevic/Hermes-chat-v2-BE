const express = require('express')
const messageController = require('../Controllers/messageController')
const authController = require('../Controllers/authController')

const router = express.Router()

router.post('/:id', authController.protect, messageController.create)

module.exports = router
