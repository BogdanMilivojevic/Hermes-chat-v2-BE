'use strict'

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserConversation extends Model {
    static associate (models) {
      UserConversation.belongsTo(models.User, { foreignKey: 'id' })
      UserConversation.belongsTo(models.Conversation, { foreignKey: 'id' })
    }
  }
  UserConversation.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    conversationId: { type: DataTypes.INTEGER }

  }, {
    sequelize,
    modelName: 'UserConversation'
  })
  return UserConversation
}
