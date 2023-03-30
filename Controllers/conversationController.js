const CatchAsyncError = require('../Utils/CatchAsyncError')
const db = require('../db/models/index')
const User = db.User
const Conversation = db.Conversation
const UserConversation = db.UserConversation
const Message = db.Message
const Image = db.Image
const { Op } = require('sequelize')
const { createConversation, deleteConversation } = require('../Utils/helpers')

exports.index = CatchAsyncError(async (req, res, next) => {
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

  if (idArr.length > 0) {
    try {
      const conversation = await Conversation.findAll({
        attributes: ['id'],
        where: {
          id: {
            [Op.or]: idArr
          }
        },
        include: [
          {
            model: User,
            attributes: ['username', 'id'],
            where: {
              [Op.not]:
                       { id: req.user.id }
            },
            through: {
              attributes: []
            }
          }
        ]
      })
      const data = await Promise.all(conversation.map(async conv => {
        const lastMessage = await Message.findOne({
          raw: true,
          nested: true,
          attributes: ['body'],
          order: [
            ['createdAt', 'DESC']
          ],
          where: {
            conversationId: conv.id
          }
        })

        const image = await conv.returnImage(conv.Users[0].id, Image)
        conv.Users[0].dataValues.photoURL = `${process.env.S3_BUCKET_URL}${image.key}`
        conv.dataValues.User = conv.Users[0]
        conv.dataValues.Users = undefined
        if (!lastMessage) {
          return conv
        } else if (lastMessage.body === null) {
          lastMessage.image = 'image'
        }
        conv.dataValues.lastMessage = lastMessage
        return conv
      }))
      res.status(200).json({
        status: 'success',
        data
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    res.status(200).json({
      status: 'success',
      conversations: []
    })
  }
})

exports.show = CatchAsyncError(async (req, res, next) => {
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
  const id = conversation.Users.find(user => user.id !== req.user.id)?.id
  const image = await conversation.returnImage(id, Image)
  conversation.Users.photoURL = `${process.env.S3_BUCKET_URL}${image.key}`

  const messages = await Message.findAll({
    limit: req.query.messagecount,
    // offset: req.query.messagecount
    where: {
      conversationId: req.params.id
    },
    order: [
      ['createdAt', 'ASC']
    ]
  })

  const images = await Image.findAll({
    where: {
      attachableType: 'message'
    }
  })

  messages.map(message => {
    images.forEach(image => {
      if (image.attachableId === message.id) {
        message.dataValues.photoURL = `${process.env.S3_BUCKET_URL}${image.key}`
      }
    })
    return message
  })

  const response = {
    id: conversation.id,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messages,
    users: conversation.Users
  }

  if (messages.length > 0) {
    res.status(200).json({
      status: 'sucess',
      conversation: {
        ...response
      }
    })
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Conversation not found'
    })
  }
})

exports.create = CatchAsyncError(async (req, res, next) => {
  const searchedUser = await User.findAll({
    raw: true,
    nest: true,
    attributes: ['id'],
    where: {
      username: req.body.searchedUserUsername
    },
    include: [
      {
        model: UserConversation,
        attributes: ['conversationId']
      }
    ]
  })

  const currentUser = await User.findAll({
    raw: true,
    nest: true,
    attributes: ['id'],
    where: {
      id: req.user.id
    },
    include: [
      {
        model: UserConversation,
        attributes: ['conversationId']
      }
    ]
  })

  const searchedUserConversationIds = searchedUser.map(conv =>
    conv.UserConversations.conversationId
  )
  const currentUserConversationIds = currentUser.map(conv =>
    conv.UserConversations.conversationId
  )

  if (currentUserConversationIds.some(id => searchedUserConversationIds.includes(id) && id !== null)) {
    res.status(422).json({
      status: 'fail',
      message: 'Conversation already exists'
    })
  } else {
    const conversation = await createConversation(searchedUser[0].id, currentUser[0].id)
    res.status(201).json({
      status: 'sucess',
      message: 'Conversation created',
      conversation
    })
  }
})

exports.delete = CatchAsyncError(async (req, res, next) => {
  await deleteConversation(req.params.id)
  res.status(204).json({
    status: 'success',
    message: 'Conversation deleted'
  })
})
