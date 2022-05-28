const mongoose = require('mongoose')

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connectDb = async () => {
    const con = await mongoose.connect(process.env.MONGO_URI || ' mongodb+srv://funbi:sladewilson101@funbiclust.9ogxi.mongodb.net/zSolutionAssementDb?retryWrites=true&w=majority', connectionParams)
    console.log(`connected to db on ${con.connection.host}`.cyan.underline.bold)

}

module.exports = connectDb