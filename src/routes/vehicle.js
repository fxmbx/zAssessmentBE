const express = require('express')

const router = express.Router({ mergeParams: true })

const { getVehicles, getVehicle, updateVehicle, deleteVehicle, addVehicle, vehiclePhotoUpload } = require('../controllers/vehicle')

const Vehicle = require('../models/Vehicle')
const advancedResults = require('../middleware/advancedResult')
const { protect, authorize } = require('../middleware/auth')

router.route('/')
    .post(protect, authorize('seller', 'admin'), addVehicle)
    .get(advancedResults(Vehicle, {
        path: 'seller',
        select: 'brandname phoneNumber1 address'
    }), getVehicles)

router.route('/:id').get(getVehicle)
    .put(protect, authorize('seller', 'admin'), updateVehicle)
    .delete(protect, authorize('seller', 'admin'), deleteVehicle)

router.route('/:id/photo')
    .put(protect, authorize('seller', 'admin'), vehiclePhotoUpload)

router.route('/:sellerId/addvehicle').post(protect, authorize('seller'), addVehicle)
// router.post('/register', register)
router.route
module.exports = router



