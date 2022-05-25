const mongoose = require('mongoose');


const SellerSchema = new mongoose.Schema({

    lastname: {
        type: String,
        required: [true, 'The lastname field is required!'],
        trim: true
    },
    firstname: {
        type: String,
        required: [true, 'The firstname field is required!'],
        trim: true
    },
    middlename: {
        type: String,
        trim: true
    },
    brandname: {
        type: String,
        required: [true, 'Brand name is required or shey you be thief?'],
        trim: true,
        unique: true
    },
    phoneNumber1: {
        type: String,
        required: [true, 'The phone number field is required'],
        maxLength: 11,
        unique: true
    },
    phoneNumber2: {
        type: String,
        maxLength: 11,
        unique: true
    },
    address: {
        type: String,
        required: [true, 'Address is required 👀']
    },
    averagePrice: { type: Number },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

})

SellerSchema.pre('remove', async function () {
    console.log(`seller account data being removed ${this._id}`)
    console.log(this.user)
    if (this.user) {
        await this.model('User').deleteMany({ seller: this._id })
        await this.model('Vehicle').deleteMany({ seller: this._id })
        next()
    }
})
module.exports = mongoose.model('Seller', SellerSchema)