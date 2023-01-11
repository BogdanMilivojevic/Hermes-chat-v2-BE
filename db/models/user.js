'use strict'
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.belongsToMany(models.Conversation, {
        through: models.UserConversation
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING
    },
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING
    },
    photoURL: DataTypes.STRING,
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
  }, {
    hooks: {
      beforeCreate: async (user, options) => {
        const hashedPassword = await bcrypt.hash(user.password, 12)
        user.password = hashedPassword
      }
    },
    sequelize,
    modelName: 'User'
  })
  return User
}
