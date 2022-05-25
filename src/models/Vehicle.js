const mongoose = require('mongoose')


const VehicleSchema = new mongoose.Schema({
    photo: {
        type: String,
        default: 'no-photo.png'
    },
    vehicleName: {
        type: String,
        required: [true, 'The lastname field is required!'],
        trim: true
    },
    vehicleDescription: {
        type: String,
        required: [true, 'The firstname field is required!'],
        trim: false
    },
    vehiclePrice: {
        type: Number,
        required: [true, 'please add a price for the vehicle']

    },
    phoneNumber: {
        type: String,
        required: [true, 'The phone number field is required'],
        maxLength: 11
    },
    createdAt: {
        type: Date,
        default: Date.Now
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'Seller',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

})

VehicleSchema.statics.getAveragePrive = async function (sellerId) {
    console.log(`calculating average cose`.yellow.inverse)

    const obj = await this.aggregate(
        [{
            $match: { seller: sellerId }
        },
        {
            $group: {
                _id: '$seller',
                avarageCost: { $avg: '$vehiclePrice' }
            }
        }])
    try {
        await this.model('Seller').findByIdAndUpdate(sellerId, {
            averagePrice: Math.ceil(obj[0].avarageCost / 10) * 10
        })
    } catch (error) {
        console.log(error)
    }
}

VehicleSchema.post('save', function (next) {
    this.constructor.getAveragePrive(this.seller)

})
VehicleSchema.post('remove', function (next) {
    this.constructor.getAveragePrive(this.seller)

})


module.exports = mongoose.model('Vehicle', VehicleSchema)
