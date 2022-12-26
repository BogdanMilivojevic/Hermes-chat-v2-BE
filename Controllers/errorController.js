const sendError = (err, res) => {
  console.log(err.message);
  if (err.message === "Email must be unique") {
    res.status(400).json({
      status: "fail",
      message: "Selected email is already in use",
    });
  } else if (err.message === "Username must be unique") {
    res.status(400).json({
      status: "fail",
      message: "Selected username is already in use",
    });
  } else if(err.message === 'Incorrect email or password'){
    res.status(400).json({
      status: "fail",
      message: "Email or password is incorrect",
    });
  } else {
    res.status(400).json({
      status:'fail',
      message:'Something went wrong'
    })
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  sendError(err, res);
};
