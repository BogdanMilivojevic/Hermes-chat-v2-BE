/**
 * @swagger
 *  components:
 *   schemas:
 *    Conversation:
 *     type: object
 *     properties:
 *      id:
 *       type: integer
 *       description: Message id
 *      createdAt:
 *       type: string
 *       description: Date and time when conversation was created
 *      updatedAt:
 *       type: string
 *       description: Date and time when conversation was updated
 * @swagger
 *  /conversation:
 *   post:
 *    summary: Create new conversation
 *    security:
 *     - Authorization: []
 *    tags: [Conversations]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conversation'
 *           examples:
 *            sample:
 *             value:
 *               searchedUserUsername: John
 *    responses:
 *      201:
 *       description: Conversation created
 *       content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *            status:
 *             type: string
 *             example: success
 *            message:
 *             type: string
 *             example: Conversation created
 *            conversation:
 *             type: object
 *             properties:
 *              id:
 *               type: integer
 *               example: 5
 *              searchedUserId:
 *               type: integer
 *               example: 55
 *              createdAt:
 *               type: string
 *               example: 2023-02-24T11:21:19.511Z
 *      403:
 *       description: JWT must be provided
 *      422:
 *       description: Conversation already exists
 *   get:
 *    summary: Get all covnersations
 *    security:
 *     - Authorization: []
 *    tags: [Conversations]
 *    responses:
 *     200:
 *      description: Conversations retrieved
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            status:
 *             type: string
 *             example: success
 *            data:
 *             type: array
 *             items:
 *              type: object
 *              properties:
 *               id:
 *                type: integer
 *                example: 5
 *               Users:
 *                type: object
 *                properties:
 *                 username:
 *                  type: string
 *                  example: John
 *                 photoURL:
 *                  type: string
 *                  example:  https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60
 *                 id:
 *                  type: integer
 *                  example: 5
 *               lastMessage:
 *                 type: object
 *                 properties:
 *                   body:
 *                    type: string
 *                    example: Hello there
 *     403:
 *      description: JWT must be provided
 * /conversation/{id}:
 *   get:
 *    summary: Get a conversation
 *    security:
 *     - Authorization: []
 *    tags: [Conversations]
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *    responses:
 *      200:
 *       description: Conversation retrieved
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              status:
 *                type: string
 *                example: success
 *              conversation:
 *                type: object
 *                properties:
 *                  id:
 *                   type: integer
 *                   example: 3
 *                  createdAt:
 *                   type: string
 *                   example: 2023-02-24T11:21:19.511Z
 *                  updatedAt:
 *                   type: string
 *                   example: 2023-02-24T11:21:19.511Z
 *                  messages:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                     id:
 *                      type: integer
 *                      example: 5
 *                     userId:
 *                      type: integer
 *                      example: 45
 *                     conversationId:
 *                      type: integer
 *                      example: 24
 *                     body:
 *                      type: string
 *                      example: How are you doing ?
 *                     createdAt:
 *                      type: string
 *                      example: 2023-02-24T11:21:19.511Z
 *                     updatedAt:
 *                      type: string
 *                      example: 2023-02-24T11:21:19.511Z
 *                  users:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                         type: integer
 *                         example: 45
 *                        username:
 *                         type: string
 *                         example: John
 *      403:
 *       description: JWT must be provided
 *      404:
 *       description: Conversation not found
 *
 */

const express = require('express')
const conversationController = require('../Controllers/conversationController')
const conversationPolicy = require('../policy/conversationPolicy')
const authentication = require('../middlewares/authentication')

const router = express.Router()

router.get('/', authentication.protect, conversationPolicy.restrictTo('user'), conversationController.index)
router.get('/:id', authentication.protect, conversationPolicy.restrictTo('user'), conversationPolicy.restrictConversation, conversationController.show)

router.post('/', authentication.protect, conversationPolicy.restrictTo('user'), conversationController.create)

module.exports = router
