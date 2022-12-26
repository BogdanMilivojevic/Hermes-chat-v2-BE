const express = require('express')
const authController = require('../Controllers/authController')


const router = express.Router()




router.route('/').post(authController.getUser)


router.post('/register',authController.register)
router.post('/login',authController.login)


module.exports = router