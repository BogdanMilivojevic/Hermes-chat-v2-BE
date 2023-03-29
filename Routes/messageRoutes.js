/**
 * @swagger
 *  components:
 *   schemas:
 *    Message:
 *     type: object
 *     properties:
 *      id:
 *       type: integer
 *       description: Message id
 *      userId:
 *       type: integer
 *       description: Sender's id
 *      conversationId:
 *       type: integer
 *       description: Conversation's id
 *      body:
 *       type: string
 *       description: Text of the message
 *      createdAt:
 *       type: string
 *       description: Date and time when message was created
 *      updatedAt:
 *       type: string
 *       description: Date and time when message was updated
 * @swagger
 *  /message/{id}:
 *   post:
 *    summary: Create new message
 *    security:
 *     - Authorization: []
 *    tags: [Messages]
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *          schema:
 *           $ref: '#/components/schemas/Message'
 *          examples:
 *           sample:
 *            value:
 *             body: Hey, how are you doing?
 *    responses:
 *        201:
 *         description: Message sent
 *         content:
 *           application/json:
 *             example:
 *              status: success
 *              message: Message created
 *              data:
 *               id: 5
 *               text: How are you doing?
 *               createdAt: 2023-02-24T11:21:19.511Z
 *         403:
 *          description: JWT must be provided
 *
 */
const express = require('express')
const messageController = require('../Controllers/messageController')
const authentication = require('../middlewares/authentication')
const conversationPolicy = require('../policy/conversationPolicy')
const AppError = require('../Utils/AppError')
const multer = require('multer')
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

router.post('/:id', authentication.protect, conversationPolicy.restrictTo('user'), upload.single('file'), messageController.create)

module.exports = router
