const CatchAsyncError = require('../Utils/CatchAsyncError')
const AppError = require('../Utils/AppError')
const { decodeJWT } = require('../Utils/helpers')
const db = require('../db/models/index')
const User = db.User
const Image = db.Image

exports.protect = CatchAsyncError(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  const decoded = await decodeJWT(token, process.env.JWT_SECRET)

  const currentUser = await User.findOne({
    where: {
      id: decoded.id
    }
  })
  const image = await currentUser.returnImage(currentUser.id, Image)
  currentUser.dataValues.photoURL = `${process.env.S3_BUCKET_URL}${image.key}`

  if (!currentUser) {
    return next(new AppError('The user does not exist', 401))
  }

  req.user = currentUser
  next()
})
