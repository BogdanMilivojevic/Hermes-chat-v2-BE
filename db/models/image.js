'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate (models) {
      Image.belongsTo(models.User, { foreignKey: 'attachableId', constraints: false })
      Image.belongsTo(models.Message, { foreignKey: 'attachableId', constraints: false })
    }
  }
  Image.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attachableType: DataTypes.ENUM('user', 'message'),
    attachableId: DataTypes.INTEGER,
    key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image'
  })
  return Image
}
