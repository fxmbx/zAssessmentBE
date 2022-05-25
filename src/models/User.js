const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'please add a name'],
        trim: true
    },
    email: {
        type: String,
        require: [true, 'if you forget your password, how are you supposed to recover it without an email genius'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please enter a valid email']

    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer'
    },
    password: {
        type: String,
        required: [true, '😬 did you just omit the password field???'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        maxlength: [11, 'Phone number can not be longer than 11 characters'],
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        required: true,
        default: Date.now,
        select: false
    },
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// I don tell you make you de calm down 

// UserSchema.method.getResetPasswordToken = function (next) {
//     const resetToken = crypto.randomBytes(20).toString('hex')

//     this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

//     this.resetPasswordToken = Date.now() + 10 * 60 * 1000;
//     return resetToken
// }


// OverKill , try de calm down funmibi
// UserSchema.pre('remove', async function (next) {
//     console.log(`users account data being removed ${this._id}`)
//     console.log(this.role)
//     if (this.role === 'buyer') {
//         await this.model('Buyer').deleteMany({ user: this._id })
//         next()
//     }
//     if (this.role === 'seller') {
//         await this.model('Seller').deleteMany({ user: this._id })
//         next()
//     }
//     
// })
module.exports = mongoose.model('User', UserSchema)