const User = require('../models/User')
const Seller = require('../models/Seller')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@route GET /api/v1/automart/getSeller
exports.getSellers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

//@route GET /api/v1/automart/getSellers/:id
exports.getSeller = asyncHandler(async (req, res, next) => {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
        next(new ErrorResponse(`Seller not found with id of ${req.params.id}`, 404))
        return
    }
    res.status(200).json({
        success: true,
        data: seller
    })
})

exports.deleteSeller = async (req, res, next) => {
    try {
        const seller = await Seller.findById(req.params.id)

        if (!seller) {
            next(new ErrorResponse(`Seller with id ${req.params.id} no de db`, 404))

            return
        }
        if (seller.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized `, 401))
        }
        seller.remove()

        res.status(200).json({
            success: true,
            data: {}
        })

    } catch (err) {
        next(err)

    }
}