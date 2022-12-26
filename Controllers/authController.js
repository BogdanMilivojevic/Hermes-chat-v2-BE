const CatchAsyncError = require("../Utils/CatchAsyncError");
const User = require("../Models/userModel");
const jwt = require('jsonwebtoken')
const {promisify }= require('util')
const AppError = require('../Utils/AppError')

const sendToken = (user,statusCode,res) => {

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  });
  res.status(statusCode).json({
    status:'success',
    token
  })

}


exports.register = CatchAsyncError(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photoURL:req.body.photoURL
  });

  sendToken(user,201,res)
});

exports.getUser = CatchAsyncError(async(req,res,next)=>{
  //Turning the token into ID
  token = req.body.token;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded.id)

 const userArr =  await User.findAll({
    where: {
      id: decoded.id
    }
  });
  const user = userArr[0].dataValues
  user.password = undefined
  user.email = undefined
  user.id = undefined

  res.status(200).json({
    status:'success',
    user
  })
})

exports.login = CatchAsyncError(async(req,res,next)=>{
  const email = req.body.email
  const password = req.body.password
  
  const userArr =  await User.findAll({
    where: {
      email: email
    }
  });
  const user = userArr[0].dataValues
  console.log(user)

  if(!user || !(await User.checkPassword(password,user.password))){
    return next(new AppError('Incorrect email or password',401))
  }

  sendToken(user,200,res)
})
