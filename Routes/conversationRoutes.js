const express = require('express')
const conversationController = require('../Controllers/conversationController')
const authController = require('../Controllers/authController')

const router = express.Router()

router.get('/', authController.protect, conversationController.index)
router.get('/:id', authController.protect, conversationController.show)

module.exports = router
