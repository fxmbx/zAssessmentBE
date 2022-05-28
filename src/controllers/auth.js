const User = require('../models/User')
const Seller = require('../models/Seller')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const crypto = require('crypto')

async function createAccount(model, accountData, userData) {
    newAccount = await User.create(userData)
    accountData.user = newAccount._id
    newAccount2 = await model.create(accountData)
    return { newAccount, newAccount2, };
}

//@route POST api/v1/auth/register
exports.register = asyncHandler(async (req, res, next) => {

    const { sellerData, userData } = req.body

    let newAccount = null
    let registered;
    switch (userData.role) {

        case 'buyer':
            newAccount = await User.create(userData)
            break;
        case 'seller':
            registered = await createAccount(Seller, sellerData, userData)
            newAccount = registered.newAccount
            if (!newAccount) { User.remove({ where: { email: userData.email } }) }
            break;
        default:
            return next(new ErrorResponse(`You Entered A Wrong User Role`, 500))
    }
    console.log(newAccount, "🧘")

    sendTokenResponse(newAccount, 201, res, "Account Created Successfully")
})

//@route POST api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        next(new ErrorResponse(`Please Provide an email and password`, 404))
        return
    }
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        next(new ErrorResponse(`Invalid Credentials brother man or woman or gender neautral individual 😅`, 401))
        return
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        next(new ErrorResponse(`Invalid Credentials brother man or woman or gender neautral individual 😅`, 401))
        return
    }

    sendTokenResponse(user, 200, res, "Login Successful")
})

//@route Post api/v1/auth/me
exports.getMe = asyncHandler(async (req, res, next) => {
    // console.log(req.user)
    const user = await User.findById(req.user.id)
    let obj = { user };
    if (user.role === 'seller') {
        const seller = await Seller.findOne({ user: user.id })
        obj = { user, seller }
    }
    res.status(200).json({
        success: true,
        data: obj
    })
})

//@route GET api/v1/auth/logout
exports.logout = asyncHandler(async (req, res, next) => {
    // console.log(req.user)
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        data: {}
    })
})
//@Private route PUT api/v1/auth/updatedetails
exports.updatedetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    if (!fieldsToUpdate) {
        next(new ErrorResponse(`Enter credentials too update my killie`, 401))
        return
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        date: user
    })

})

//@Private route PUT api/v1/auth/updatePassword
exports.updatePassword = asyncHandler(async (req, res, next) => {
    // console.log(req.user)
    const user = await User.findById(req.user.id).select('+password')
    // console.log(user, "😆")
    if (!(await user.matchPassword(req.body.currentpassword))) {
        next(ErrorResponse(`Password is incorrect`, 401))
        return
    }
    user.password = req.body.newPassword
    await user.save()

    sendTokenResponse(user, 200, res, "Passoword Updated 😄")


})



const sendTokenResponse = (user, statusCode, res, message) => {
    const token = user.getSignedJwtToken();
    // const options = {
    //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    //     httpOnly: true
    // }
    // if (process.env.NODE_ENV === 'production') {
    //     options.secure = true
    // }

    res.status(statusCode).json({
        success: true,
        message: message,
        data: { token }
    })
}