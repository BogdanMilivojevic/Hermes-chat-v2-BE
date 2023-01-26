const express = require('express')
const authController = require('../Controllers/authController')
const userController = require('../Controllers/userController')

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)

router.get('/me', authController.protect, userController.getLoggedInUser)
router.get('/:username', authController.protect, userController.getSearchedUser)

module.exports = router
