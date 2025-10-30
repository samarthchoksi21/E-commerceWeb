require('dotenv').config()
const jwt = require('jsonwebtoken')
const { USER } = require('../models/user')

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        username: user.username,
    }, process.env.JWT_SECRETKEY, { expiresIn: '1h' })

}

async function getUser(token) {
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRETKEY)
        const user = await USER.findById(decode._id)
        return user || null

    } catch (error) {
        console.log("ERROR : ", error)
    }

}

module.exports = {
    setUser,
    getUser,
}