const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'The Token field is required'],
        trim: true,
        unique: true
    },
    userId: {
        type: String,
        enum: ['RESET', 'VERIFY', 'REFRESH']
    },
    tokenExpiry: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Token', TokenSchema)
