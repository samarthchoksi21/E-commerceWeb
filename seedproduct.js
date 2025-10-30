const mongoose = require('mongoose')
const { PRODUCT } = require('./models/user')
const data = require('./PRODUCTS/products')
require('dotenv').config()

async function InsertData() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("CONNECTION STARTED")

        await PRODUCT.deleteMany({})
        await PRODUCT.insertMany(data)
        console.log("Data inserted successfully")

    } catch (err) {
        console.log("ERROR WHILE INSERTING : ", err)
    } finally {
        mongoose.connection.close()
        console.log("CONNECTION CLOSED")
    }


}
InsertData()