'use strict'

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate (models) {
      Message.belongsTo(models.User, { foreignKey: 'id' })
      Message.belongsTo(models.Conversation, { foreignKey: 'id' })
      Message.hasOne(models.Image, {
        foreignKey: 'attachableType',
        constraints: false,
        scope: {
          attachableType: 'message'
        }
      })
    }
  }
  Message.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    conversationId: { type: DataTypes.INTEGER },
    body: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Message'
  })
  return Message
}
