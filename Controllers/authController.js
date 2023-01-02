const CatchAsyncError = require('../Utils/CatchAsyncError')
const jwt = require('jsonwebtoken')
const AppError = require('../Utils/AppError')
const { promisify } = require('util')
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

  const user = await User.unscoped().findOne({
    raw: true,
    where: {
      email
    }
  })
  if (!user || !(await checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  sendToken(user, 200, res)
})

exports.protect = CatchAsyncError(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const currentUser = await User.findOne({
    raw: true,
    where: {
      id: decoded.id
    }
  })
  if (!currentUser) {
    return next(new AppError('The user does not exist', 401))
  }

  req.user = currentUser
  next()
})
