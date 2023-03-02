const CatchAsyncError = require('../Utils/CatchAsyncError')
const db = require('../db/models/index')
const Message = db.Message
const Conversation = db.Conversation
const User = db.User

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
      text: message.dataValues.body,
      createdAt: message.dataValues.createdAt
    }
  })
})
