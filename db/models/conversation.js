'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate (models) {
      Conversation.belongsToMany(models.User, {
        through: models.UserConversation
      })
    }
  }
  Conversation.init({
    id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {
    sequelize,
    modelName: 'Conversation'
  })
  return Conversation
}
