const AppError = require("../utilities/ErrorHandler");
const AsyncError = require("../utilities/AsyncError");
const Jwt = require("jsonwebtoken");
const User = require("../Models/userModel");


exports.VerifyUser = AsyncError(async(req, res, next) => {
    let token
     if (
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
     ) {
        token = req.headers.authorization.split(' ')[1]
     }

     const decoded = Jwt.verify(token, process.env.JWT_SECRET)

   //   console.log(decoded)

     req.user = await User.findById(decoded.id)

     console.log(req.user.isWriter)
   

     if (!token && req.user.isWriter === false) { 
        return next(new AppError('You dont have access to this route', 401))
     }
     next()
})