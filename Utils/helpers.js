const bcrypt = require('bcrypt')
const { sequelize } = require('../db/models')
const db = require('../db/models/index')
const Conversation = db.Conversation
const UserConversation = db.UserConversation
const User = db.User
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const AppError = require('./AppError')

const checkPassword = async function (loginPassword, dbPassword) {
  return await bcrypt.compare(loginPassword, dbPassword)
}

const createConversation = async function (currentUserId, searchedUserId) {
  const t = await sequelize.transaction()
  try {
    const conversation = await Conversation.create({
    }, { transaction: t })

    await UserConversation.create({
      userId: currentUserId,
      conversationId: conversation.dataValues.id
    }, { transaction: t })

    await UserConversation.create({
      userId: searchedUserId,
      conversationId: conversation.dataValues.id
    }, { transaction: t })

    await t.commit()

    const data = {
      conversationId: conversation.dataValues.id,
      searchedUserId,
      createdAt: conversation.dataValues.createdAt
    }

    return data
  } catch (err) {
    console.log(err)
    await t.rollback()
  }
}

const deleteConversation = async function (chatId) {
  const t = await sequelize.transaction()
  try {
    await Conversation.destroy({
      where: {
        id: chatId
      }
    }, { transaction: t })
    return
  } catch (err) {
    console.log(err)
    await t.rollback()
  }
}

const decodeJWT = async function (token, jwtENV) {
  const decoded = await promisify(jwt.verify)(token, jwtENV)

  const currentUser = await User.findOne({
    raw: true,
    where: {
      id: decoded.id
    }
  })
  if (!currentUser) {
    return new AppError('The user does not exist', 401)
  }

  return currentUser
}

module.exports = { checkPassword, createConversation, decodeJWT, deleteConversation }
