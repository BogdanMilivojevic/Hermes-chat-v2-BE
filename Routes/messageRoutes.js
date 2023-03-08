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
const authController = require('../Controllers/authController')

const router = express.Router()

router.post('/:id', authController.protect, messageController.create)

module.exports = router
