'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate (models) {
      Conversation.belongsToMany(models.User, {
        through: models.UserConversation, foreignKey: 'conversationId'
      })
      Conversation.hasMany(models.Message, {
        onDelete: 'CASCADE',
        foreignKey: 'conversationId'
      })
      Conversation.hasMany(models.UserConversation, {
        onDelete: 'CASCADE',
        foreignKey: 'conversationId'
      })
    }
  }
  Conversation.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
  }, {
    sequelize,
    modelName: 'Conversation'
  })
  Conversation.prototype.returnImage = async function (userId, model) {
    const image = await model.findOne({
      where: {
        attachableType: 'user',
        attachableId: userId
      }
    })
    return image
  }
  return Conversation
}
