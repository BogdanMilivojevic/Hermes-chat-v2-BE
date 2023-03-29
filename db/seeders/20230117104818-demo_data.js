'use strict'
const db = require('../models/index')
const User = db.User
const Conversation = db.Conversation
const UserConversation = db.UserConversation
const Message = db.Message
const Image = db.Image

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user1 = await User.create({
      username: 'John',
      email: 'john@test.com',
      password: '123456'
    })
    await Image.create({
      attachableType: 'user',
      attachableId: user1.id,
      key: 'john.jpg'
    })
    const user2 = await User.create({
      username: 'Peter',
      email: 'peter@test.com',
      password: '123456'
    })
    await Image.create({
      attachableType: 'user',
      attachableId: user2.id,
      key: 'peter.jpg'
    })
    const conversation1 = await Conversation.create({
    })
    await UserConversation.create({
      userId: user1.dataValues.id,
      conversationId: conversation1.dataValues.id
    })
    await UserConversation.create({
      userId: user2.dataValues.id,
      conversationId: conversation1.dataValues.id
    })
    await Message.create({
      userId: user1.dataValues.id,
      conversationId: conversation1.dataValues.id,
      body: 'Hello brother, how are you doing?'
    })
    await Message.create({
      userId: user2.dataValues.id,
      conversationId: conversation1.dataValues.id,
      body: 'I am pretty fine and how are you'
    })

    const user3 = await User.create({
      username: 'Jack',
      email: 'jack@test.com',
      password: '123456'
    })
    await Image.create({
      attachableType: 'user',
      attachableId: user3.id,
      key: 'jack.jpg'
    })
    const conversation2 = await Conversation.create({
    })

    await UserConversation.create({
      userId: user1.dataValues.id,
      conversationId: conversation2.dataValues.id
    })
    await UserConversation.create({
      userId: user3.dataValues.id,
      conversationId: conversation2.dataValues.id
    })
    await Message.create({
      userId: user1.dataValues.id,
      conversationId: conversation2.dataValues.id,
      body: 'Hello my man how are you doing'
    })
    await Message.create({
      userId: user3.dataValues.id,
      conversationId: conversation2.dataValues.id,
      body: 'Hey bro, I am doing great, hbu?'
    })
  },

  async down (queryInterface, Sequelize) {
    await User.destroy({
      truncate: true, cascade: true
    })
    await Conversation.destroy({
      truncate: true, cascade: true
    })

    await UserConversation.destroy({
      truncate: true, cascade: true
    })

    await Message.destroy({
      truncate: true, cascade: true
    })
  }
}
