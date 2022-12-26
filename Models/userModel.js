const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://postgres:Stefan123@localhost:5432/Hermes-chat"
);
const bcrypt = require('bcrypt')

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Username must be unique",
      },
      allowNull: false,
      validate: {
        min: {
          args: [[6]],
          msg: "Cant have less than 6 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email must be unique",
      },
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      min: 8,
      allowNull: false,
      validate: {
        min: {
          args: [[8]],
          msg: "Password cant have less than 8 characters",
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL,
      min: 8,
      allowNull: false,
      validate: {
        min: {
          args: [[8]],
          msg: "Password cant have less than 8 characters",
        },
        isMatching(value) {
          if (value !== this.password) {
            throw new Error("Passwords dont match");
          }
        },
      },
    },
    photoURL:{
      type:DataTypes.STRING,
      allowNull:false
    },
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    }
  },
  {
    tableName: "Users",
  }
);


User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password,12);
  user.password = hashedPassword;
});

User.checkPassword = async function(loginPassword,dbPassword){
  return await bcrypt.compare(loginPassword,dbPassword)
}




User.sync({ alter: true });

module.exports = User;
