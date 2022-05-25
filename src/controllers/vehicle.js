const User = require('../models/User')
const Seller = require('../models/Seller')
const Vehicle = require('../models/Vehicle')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')


//@route GET /api/v1/courses
//       GET /api/v1/bootcamps/:sellerId/getVehicles
exports.getVehicles = asyncHandler(async (req, res, next) => {
    if (req.params.sellerId) {
        const vehicles = await Vehicle.find({ seller: req.params.sellerId })
        return res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
})


exports.getVehicle = asyncHandler(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id).populate({ path: 'seller', select: 'brandname phoneNumber1 address' })

    if (!vehicle) {
        return next(new ErrorResponse(`No vehicle wit Id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: vehicle
    })
})

exports.addVehicle = asyncHandler(async (req, res, next) => {
    console.log(req.body)
    req.body.seller = req.params.sellerId
    req.body.user = req.user.id

    const seller = await Seller.findById(req.params.sellerId)
    if (!seller) {
        return next(new ErrorResponse(`No Sellecr with Id ${req.params.sellerId} found`, 404))
    }
    if (seller.user.toString() != req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse(`User  ${req.user.id} is not authorized to add a vehicle to Seller ${bootcamp._id} account`, 403))
        return
    }
    const vehicle = await Vehicle.create(req.body)
    res.status(200).json({ success: true, data: vehicle })
})

exports.updateVehicle = asyncHandler(async (req, res, next) => {
    let vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) {
        next(new ErrorResponse(`No Vehicle with Id ${res.params.id} exist`, 404))
        return
    }
    if (vehicle.user.toString() !== req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse(`User  ${req.user.id} is not authorized to update a Vehicle to belonging to seller ${vehicle._id}`, 404))
        return
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200).json({ success: true, data: Vehicle })
})

exports.deleteVehicle = asyncHandler(async (req, res, next) => {

    const vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) {
        next(new ErrorResponse(`No Vehicle with Id ${res.params.id} exist`, 404))
        return
    }
    if (vehicle.user.toString() !== req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse(`User  ${req.user.id} is not authorized to delete a Vehicle belinging to  Seller ${vehicle._id}`, 404))
        return
    }
    await vehicle.remove()
    res.status(200).json({ success: true, data: {} })
})


exports.vehiclePhotoUpload = asyncHandler(async (req, res, next) => {

    const vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) {
        next(new ErrorResponse(`Vehicle with id ${req.params.id} no de db`, 404))

        return
    }
    if (vehicle.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized `, 401))
    }
    if (!req.files) {
        next(new ErrorResponse(`Please upload file`, 404))

        return
    }
    // console.log(`Files \n: ${req.files}`, req.files)

    // const file = req.files
    const file = req.files[Object.keys(req.files)[0]]
    console.log(req.files[Object.keys(req.files)[0]])

    // console.log(typeof file)
    if (!file.mimetype.startsWith('image')) {
        next(new ErrorResponse(`Please upload an image file`, 400))
        return
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        next(new ErrorResponse(`please upload an image less than 1mb`, 400))
        return
    }

    file.name = `photo_${vehicle._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse('problem with file upload', 500))
        }
    })
    console.log(file.name)

    await Vehicle.findByIdAndUpdate(req.params.id, { photo: file.name })
    res.status(200).json({
        success: true,
        data: file.name
    })


})