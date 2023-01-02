const CatchAsyncError = require('../Utils/CatchAsyncError')
const jwt = require('jsonwebtoken')
const AppError = require('../Utils/AppError')
const db = require('../db/models/index')
const User = db.User
const checkPassword = require('../Utils/helpers')

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`
  })
  res.status(statusCode).json({
    status: 'success',
    token
  })
}

exports.register = CatchAsyncError(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    photoURL: req.body.photoURL
  })

  sendToken(user, 201, res)
})

exports.login = CatchAsyncError(async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  const userArr = await User.findAll({
    where: {
      email
    }
  })
  const user = userArr[0].dataValues
  console.log(user)

  if (!user || !(await checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  sendToken(user, 200, res)
})
