const express = require('express')
const router = express.Router({ mergeParams: true })
const advancedResults = require('../middleware/advancedResult')
const Seller = require('../models/Seller')
const { getSeller, getSellers, deleteSeller } = require('../controllers/seller')

const { protect, authorize } = require('../middleware/auth')




const vehicleRouter = require('./vehicle')

router.use('/:sellerId/vehicle', vehicleRouter)

router.route('/').get(advancedResults(Seller), protect, getSellers)
// router.get('/getSellers', protect, getSellers)



router.route('/:id').get(protect, getSeller).delete(protect, authorize('seller', 'admin'), deleteSeller)



module.exports = router;
