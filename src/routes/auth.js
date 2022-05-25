const express = require('express')

const { register, login, logout, updatePassword, updatedetails, getMe } = require('../controllers/auth')
const { protect } = require('../middleware/auth')

const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/getMe', protect, getMe)
router.put('/updatedetails', protect, updatedetails)
router.put('/updatepassword', protect, updatePassword)

module.exports = router;  