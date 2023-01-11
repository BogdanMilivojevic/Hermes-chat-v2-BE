const sendError = (err, res) => {
  if (err.message === 'Validation error') {
    res.status(422).json({
      status: 'fail',
      message: err.errors[0].message
    })
  } else if (err.message === 'Incorrect email or password') {
    res.status(401).json({
      status: 'fail',
      message: err.message
    })
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong'
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  sendError(err, res)
}
