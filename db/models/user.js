'use strict'
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.belongsToMany(models.Conversation, {
        through: models.UserConversation, foreignKey: 'userId'
      })
      User.hasMany(models.Message, {
        foreignKey: 'userId'
      })
      User.hasMany(models.UserConversation, {
        foreignKey: 'userId'
      })
      User.hasOne(models.Image, {
        foreignKey: 'attachableType',
        constraints: false,
        scope: {
          attachableType: 'user'
        }
      })
    }
  }
  User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: {
      type: DataTypes.STRING
    },
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    }
  }, {
    hooks: {
      beforeCreate: async (user, options) => {
        const hashedPassword = await bcrypt.hash(user.password, 12)
        user.password = hashedPassword
      }
    },
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    sequelize,
    modelName: 'User'
  })
  User.prototype.returnImage = async function (userId, model) {
    const image = await model.findOne({
      where: {
        attachableType: 'user',
        attachableId: userId
      }
    })
    return image
  }
  return User
}
