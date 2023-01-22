const CatchAsyncError = require('../Utils/CatchAsyncError')
const db = require('../db/models/index')
const Message = db.Message

exports.create = CatchAsyncError(async (req, res, next) => {
  const message = await Message.create({
    userId: req.user.id,
    conversationId: req.params.id,
    body: req.body.text
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
