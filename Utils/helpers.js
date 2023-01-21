const bcrypt = require('bcrypt')
const { sequelize } = require('../db/models')
const db = require('../db/models/index')
const Conversation = db.Conversation
const UserConversation = db.UserConversation

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

module.exports = { checkPassword, createConversation }
