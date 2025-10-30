const express = require('express')
const {
    RenderSignupPage,
    SignupPageCreateUser,
    RenderLoginPage,
    LoginCheck,
    RenderWebPage,
    ProductsFrontend,
    AddToCart,
    BuyNowPage,
    RenderCart,
    CartRemover,
    RenderProfile,
    LogoutPage,
    RenderBuyPage
} = require('../controller/user')
const { RestrictLoggedUser } = require('../middleware/auth')
const router = express.Router()
router.get('/signup', RenderSignupPage)
router.post('/signup', SignupPageCreateUser)
router.get('/login', RenderLoginPage)
router.post('/login', LoginCheck)
router.get('/web', RestrictLoggedUser, RenderWebPage)
router.get('/product', ProductsFrontend)
router.get('/cart', RestrictLoggedUser, RenderCart)
router.get('/cart/add/:id', RestrictLoggedUser, AddToCart)
router.get('/buy/:id', BuyNowPage)
router.get('/buy', RenderBuyPage)
router.post('/cart/remove/:id', RestrictLoggedUser, CartRemover)
router.get('/profile', RestrictLoggedUser, RenderProfile)
router.get('/logout', LogoutPage)

module.exports = router