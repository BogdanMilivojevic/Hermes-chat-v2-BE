const CatchAsyncError = require('../Utils/CatchAsyncError')
const db = require('../db/models/index')
const User = db.User
const Image = db.Image

exports.getLoggedInUser = CatchAsyncError(async (req, res, next) => {
  const user = req.user
  if (user) {
    res.status(200).json({
      status: 'success',
      user
    })
  }
})

exports.getSearchedUser = CatchAsyncError(async (req, res, next) => {
  const username = req.params.username
  const user = await User.findOne({
    where: {
      username
    }
  })

  if (user) {
    const image = await user.returnImage(user.id, Image)
    user.dataValues.photoURL = `${process.env.S3_BUCKET_URL}${image.key}`
    res.status(200).json({
      status: 'success',
      message: 'User found',
      user
    })
  } else {
    res.status(200).json({
      message: 'User not found'

    })
  }
})
