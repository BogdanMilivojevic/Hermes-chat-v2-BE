/**
 * @swagger
 *  components:
 *   schemas:
 *     User:
 *      type: object
 *      required:
 *       - username
 *       - email
 *       - password
 *       - photoURL
 *      properties:
 *        id:
 *         type: integer
 *         description: User's id
 *        username:
 *         type: string
 *         description: User's username
 *        email:
 *         type: string
 *         description: User's email
 *        password:
 *         type: string
 *         description: User's password
 *        photoURL:
 *         type: string
 *         description: User's photo URL
 *        createdAt:
 *         type: string
 *         description: Date and time when user's profile was created
 *        updatedAt:
 *         type: string
 *         description: Date and time when user's profile was updated
 * @swagger
 *  /user/register:
 *   post:
 *    summary: Creating new user
 *    tags: [Users]
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/User'
 *        examples:
 *         sample:
 *          value:
 *           username: Arthur
 *           email: arthur@test.com
 *           password: "123456"
 *           photoURL: https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZmFjZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60
 *    responses:
 *     200:
 *      description: User registered
 *      content:
 *        application/json:
 *          example:
 *           status: success
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *     400:
 *      description: Missing request parameters
 *     422:
 *      description: Unprocessable entity
 * /user/login:
 *  post:
 *   summary: User login
 *   tags: [Users]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *       examples:
 *        sample:
 *         value:
 *          email: john@test.com
 *          password: "123456"
 *   responses:
 *     200:
 *      description: Login successful
 *      content:
 *        application/json:
 *         example:
 *           status: success
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *     400:
 *      description: Missing request parameters
 *     401:
 *      description: Incorrect email or password
 * /user/me:
 *  get:
 *   summary: Get curernt user
 *   security:
 *     - Authorization: []
 *   tags: [Users]
 *   responses:
 *      200:
 *       description: User successfully retrieved
 *       content:
 *        application/json:
 *         example:
 *           status: success
 *           user:
 *            id: 7
 *            username: John
 *            email: john@test.com
 *            photoURL: https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60
 *            createdAt: 2023-02-24T11:21:19.511Z
 *            updatedAt: 2023-02-24T11:21:19.511Z
 *      403:
 *       description: JWT must be provided
 *      404:
 *       description: User doesn't exist
 * /user/{username}:
 *  get:
 *   summary: Get user by username
 *   security:
 *    - Authorization: []
 *   tags: [Users]
 *   parameters:
 *       - in: path
 *         name: username
 *         required: true
 *   responses:
 *     200:
 *      description: User found
 *      content:
 *       application/json:
 *         example:
 *          status: success
 *          user:
 *           id: 7
 *           username: John
 *           email: john@test.com
 *           photoURL: https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60
 *           createdAt: 2023-02-24T11:21:19.511Z
 *           updatedAt: 2023-02-24T11:21:19.511Z
 *     403:
 *      description: JWT must be provided
 *     404:
 *      description: User doesn't exist
 *
 *
 */

const express = require('express')
const authController = require('../Controllers/authController')
const userController = require('../Controllers/userController')
const authentication = require('../middlewares/authentication')
const conversationPolicy = require('../policy/conversationPolicy')
const multer = require('multer')
const AppError = require('../Utils/AppError')
const upload = multer({
  limits: { fileSize: 4194304 },
  fileFilter (req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new AppError('Please upload a valid image file', 422))
    }
    callback(undefined, true)
  }
})

const router = express.Router()

router.post('/register', upload.single('avatar'), authController.register)
router.post('/login', authController.login)

router.get('/me', authentication.protect, conversationPolicy.restrictTo('user'), userController.getLoggedInUser)
router.get('/:username', authentication.protect, conversationPolicy.restrictTo('user'), userController.getSearchedUser)

module.exports = router
