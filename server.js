const express = require('express')
const colors = require('colors')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoSanitize = require('express-mongo-sanitize')
const fileupload = require('express-fileupload')
const path = require('path')
const indexRouter = require('./src/routes/index')
const connectDb = require('./config/db')
const logger = require('./src/middleware/logger')
const errorHandler = require('./src/middleware/error')


dotenv.config({ path: './config/config.env' })
connectDb()
const app = express()
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(logger)
}

app.use(cors())
app.use(mongoSanitize())
app.use(express.static(path.join(__dirname, 'public')))


//Base Route
app.use('/api/v1/', indexRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}...😃`.blue.bold)
})


process.on('unhandledRejection', (err, promise) => {
    console.log(`Opps unhandled rejection 😞\nError : ${err.message}`.red)
    server.close(() => { process.exit(1) })
})