const CatchAsyncError = require('../Utils/CatchAsyncError')
const db = require('../db/models/index')
const Message = db.Message
const Conversation = db.Conversation
const User = db.User
const Image = db.Image
const { s3Client } = require('../Utils/s3Client')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { randomUUID } = require('crypto')
exports.create = CatchAsyncError(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: User,
      attributes: ['id', 'username'],
      through: {
        attributes: []
      }
    }
  })

  if (req.file) {
    const file = req.file
    const id = randomUUID()
    try {
      await s3Client.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: id + file.originalname, Body: req.file.buffer, ACL: 'public-read' }))
      const message = await Message.create({
        userId: req.user.id,
        conversationId: conversation.id,
        body: req.body.text
      })

      const image = await Image.create({
        attachableType: 'message',
        attachableId: message.id,
        key: id + file.originalname
      })
      message.dataValues.photoURL = `${process.env.S3_BUCKET_URL}${image.key}`

      conversation.Users.forEach((user) => {
        req.io.to(user.username).emit('newMessage', message)
      })
      res.end()
    } catch (err) {
      console.log('Error', err)
    }
  } else {
    const message = await Message.create({
      userId: req.user.id,
      conversationId: conversation.id,
      body: req.body.text
    })

    // Emiting socket events
    conversation.Users.forEach((user) => {
      req.io.to(user.username).emit('newMessage', message)
    })

    res.status(201).json({
      status: 'sucess',
      message: 'Message created',
      data: {
        id: message.id,
        text: message.body,
        createdAt: message.createdAt
      }
    })
  }
})
