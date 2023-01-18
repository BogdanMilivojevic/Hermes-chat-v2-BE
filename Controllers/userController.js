const CatchAsyncError = require('../Utils/CatchAsyncError')
const db = require('../db/models/index')
const User = db.User

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
    raw: true,
    where: {
      username
    }
  })
  if (user) {
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
