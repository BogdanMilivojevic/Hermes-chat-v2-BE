const CatchAsyncError = require('../Utils/CatchAsyncError')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const db = require('../db/models/index')
const User = db.User

exports.getLoggedInUser = CatchAsyncError(async (req, res, next) => {
  // Turning the token into ID
  const token = req.body.token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  console.log(decoded.id)

  const userArr = await User.findAll({
    where: {
      id: decoded.id
    }
  })
  const user = userArr[0].dataValues
  user.password = undefined
  user.id = undefined

  res.status(200).json({
    status: 'success',
    user
  })
})

exports.getSearchedUser = CatchAsyncError(async (req, res, next) => {
  const username = req.body.username

  const userArr = await User.findAll({
    where: {
      username
    }
  })
  const users = userArr[0].dataValues
  users.password = undefined
  users.id = undefined

  res.status(200).json({
    status: 'success',
    users
  })
})
