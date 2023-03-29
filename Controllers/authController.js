const CatchAsyncError = require('../Utils/CatchAsyncError')
const jwt = require('jsonwebtoken')
const AppError = require('../Utils/AppError')
const db = require('../db/models/index')
const User = db.User
const Image = db.Image
const { checkPassword } = require('../Utils/helpers')
const { s3Client } = require('../Utils/s3Client')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { randomUUID } = require('crypto')

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
  if (!req.body.username || !req.body.email || !req.body.password || !req.file) {
    return next(new AppError('Missing request parameters', 400))
  }
  const file = req.file
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  const id = randomUUID()
  try {
    await s3Client.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: id + file.originalname, Body: req.file.buffer, ACL: 'public-read' }))

    await Image.create({
      attachableType: 'user',
      attachableId: user.id,
      key: id + file.originalname
    })
    sendToken(user, 201, res)
  } catch (err) {
    console.log(err)
  }
})

exports.login = CatchAsyncError(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new AppError('Missing request parameters', 400))
  }
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
