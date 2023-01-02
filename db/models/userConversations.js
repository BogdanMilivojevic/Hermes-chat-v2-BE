'use strict'

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserConversation extends Model {
    static associate (models) {
      UserConversation.belongsTo(models.User)
      UserConversation.belongsTo(models.Conversation)
    }
  }
  UserConversation.init({
    id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    sequelize,
    modelName: 'UserConversation'
  })
  return UserConversation
}
