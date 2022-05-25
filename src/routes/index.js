const express = require('express')


const router = express.Router()
const path = require('path')

const authRouter = require('./auth')
const vehicleRouter = require('./vehicle')
const sellerRouter = require('./seller')
// const advancedResults = require('../middlewares/advancedResult')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs.html'))
})

router.use('/auth', authRouter)
router.use('/vehicle', vehicleRouter)
router.use('/seller', sellerRouter)


module.exports = router