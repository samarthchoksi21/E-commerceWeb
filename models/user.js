const mongoose = require('mongoose')
const userschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PRODUCT'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]

}, { timestamps: true })
const USER = mongoose.model("USER", userschema)
const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    AdminName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }

})
const ADMIN = mongoose.model("ADMIN", AdminSchema)

const productschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String

    },
    price: {
        type: Number
    },
    category: {
        type: String
    },
    image: {
        type: String
    },
    stock: {
        type: Number,
        default: 0
    }



})
const PRODUCT = mongoose.model("PRODUCT", productschema)
module.exports = {
    USER,
    ADMIN,
    PRODUCT
}