const { MongoConnection } = require('./connection')
const { RestrictLoggedUser } = require('./middleware/auth')
const express = require('express')
const cookie_parser = require('cookie-parser')
const app = express()
const PORT = process.env.PORT
app.use(cookie_parser())
const path = require('path')
const UserRoute = require('./routes/user')

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

MongoConnection()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"));
app.use("/PRODUCTS/images", express.static("PRODUCTS/images"));


app.use('/', UserRoute)
app.get("/", (req, res) => {
    res.redirect('/signup')
})
app.listen(PORT, () => {
    console.log("SERVER STARTED..!!")
})