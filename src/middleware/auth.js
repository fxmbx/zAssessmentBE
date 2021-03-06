const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

exports.protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new ErrorResponse(`Not Authorized to access this route`, 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(token)
        console.log(decoded)

        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return next(new ErrorResponse(`Not Authorized to access this route ${error.message}`, 401))
    }
})


exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(roles)
            console.log(req.user.role)
            return next(new ErrorResponse(`Access denied 😞, user role, ${req.user.role} is unauthorized`, 403))
        }
        next()
    }
}