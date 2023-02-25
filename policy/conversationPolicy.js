const CatchAsyncError = require('../Utils/CatchAsyncError')
const AppError = require('../Utils/helpers')
const db = require('../db/models/index')
const UserConversation = db.UserConversation

exports.restrictTo = (role) => CatchAsyncError(async (req, res, next) => {
  if (role !== req.user.role) {
    return next(new AppError('You dont have permission', 403))
  }
  next()
})

exports.restrictConversation = CatchAsyncError(async (req, res, next) => {
  const conversationIds = await UserConversation.findAll({
    raw: true,
    attributes: ['conversationId'],
    where: {
      userId: req.user.id
    }
  })
  const idArr = conversationIds.map((conv) => {
    return conv.conversationId
  })
  if (!idArr.includes(+req.params.id)) {
    return next(new AppError('You dont have permission', 403))
  }
  next()
})
