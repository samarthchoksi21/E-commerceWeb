require('dotenv').config()
const mongoose = require('mongoose')
const { ADMIN } = require('../models/user')
const bcrypt = require('bcrypt')
async function seed() {
    await mongoose.connect(process.env.MONGO_URI)
    const AdminName = "Samarth_choksi"
    const email = "choksisamarth2@gmail.com"
    const plain = "samarth553_"
    const exist = await ADMIN.findOne({ email })
    if (exist) {
        console.log("Email already exist")
        process.exit(0)
    }

    const hash = await bcrypt.hash(plain, 10)

    await ADMIN.create({
        email: email,
        AdminName: AdminName,
        password: hash,
    })
    console.log("Admin created")
    mongoose.connection.close()



}
seed().catch(err => {
    console.log(`ERROR: ${err}`)
})