const express = require('express')
const authController = require('../Controllers/authController')
const userController = require('../Controllers/userController')

const router = express.Router()

router.route('/').post(userController.getLoggedInUser)
router.post('/getSearchedUser', userController.getSearchedUser)

router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router
