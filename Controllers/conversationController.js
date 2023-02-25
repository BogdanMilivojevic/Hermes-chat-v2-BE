const CatchAsyncError = require('../Utils/CatchAsyncError')
const db = require('../db/models/index')
const User = db.User
const Conversation = db.Conversation
const UserConversation = db.UserConversation
const Message = db.Message
const { Op } = require('sequelize')
const { createConversation } = require('../Utils/helpers')

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
        raw: true,
        nest: true,
        where: {
          id: {
            [Op.or]: idArr
          }
        },
        include: [
          {
            model: User,
            attributes: ['username', 'photoURL', 'id'],
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
        if (!lastMessage) {
          return conv
        }
        conv.lastMessage = lastMessage
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

  const messages = await Message.findAll({
    limit: req.query.messagecount,
    // offset: req.query.messagecount
    where: {
      conversationId: req.params.id
    },
    order: [
      ['createdAt', 'DESC']
    ]

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
