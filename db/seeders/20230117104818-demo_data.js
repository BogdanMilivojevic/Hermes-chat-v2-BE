'use strict'
const db = require('../models/index')
const User = db.User
const Conversation = db.Conversation
const UserConversation = db.UserConversation
const Message = db.Message

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user1 = await User.create({
      username: 'John',
      email: 'john@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    })
    const user2 = await User.create({
      username: 'Peter',
      email: 'peter@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFjZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
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
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZmFjZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
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
