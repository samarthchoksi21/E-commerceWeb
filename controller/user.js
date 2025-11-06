const bcrypt = require('bcrypt')
const { USER } = require('../models/user')
const { PRODUCT } = require('../models/user')
const items = require('../PRODUCTS/products')
const { setUser } = require('../service/auth')
async function RenderSignupPage(req, res) {
    res.render("signup")

}
async function SignupPageCreateUser(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json("Credentials required");
        }
        const emailNormalized = email.toLowerCase();

        const user = await USER.findOne({ email: emailNormalized });
        if (user) {
            return res.status(400).json({ ERROR: "This email already exists", redirect: "/signup" });
        }
        const name = await USER.findOne({ username: username });
        if (name) {
            return res.status(400).json({ ERROR: "This username already exist" })
        }


        const hash = await bcrypt.hash(password, 10);

        await USER.create({ email: emailNormalized, username, password: hash });

        return res.status(200).json({ message: "Signup successful", redirect: "/login" });
    } catch (err) {
        console.log("Signup Error:", err);
        return res.status(200).json({ ERROR: "Internal Server error" });
    }
}

async function RenderLoginPage(req, res) {
    res.render("login")

}
async function LoginCheck(req, res) {

    const { email, password } = req.body
    const user = await USER.findOne({ email })
    if (!user) {
        return res.status(400).json({ ERROR: "Invalid Email" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({ ERROR: "Invalid password" })
    }
    const payload = await USER.findOne({ email })
    const token = setUser(payload)
    res.cookie("uid", token, {

        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000

    })
    res.status(200).json({ status: true, redirect: "/web" })

}
async function ProductsFrontend(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const category = req.query.category;
        const search = req.query.search;

        const filter = {};

        if (category && category !== 'All') {
            filter.category = { $regex: new RegExp(category.trim(), 'i') };
        }



        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await PRODUCT.find(filter).skip(skip).limit(limit);
        const total = await PRODUCT.countDocuments(filter);

        const hasMore = skip + products.length < total;

        return res.json({ products, total, hasMore });
    } catch (error) {
        console.log("ERROR : ", error);
        res.status(500).json({ ERROR: "Server error" });
    }
}
async function AddToCart(req, res) {
    try {
        const user = await USER.findById(req.User._id);
        const product = await PRODUCT.findById(req.params.id);

        if (!product) return res.status(404).send('Product not found');

        const cartItem = user.cart.find(item => item.productId.equals(product._id));

        if (cartItem) {

            cartItem.qty = (cartItem.qty || 1) + 1;
            console.log("Updated Qty:", cartItem.qty);
        } else {

            user.cart.push({ productId: product._id, qty: 1 });
        }

        await user.save();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding to cart');
    }
}


async function RenderCart(req, res) {
    try {
        const user = await USER.findById(req.User._id).populate('cart.productId');


        const cartItems = user.cart
            .filter(c => c.productId)
            .map(c => ({
                product: c.productId,
                qty: c.qty || 1
            }));

        const totalPrice = cartItems.reduce(
            (sum, item) => sum + (item.product.price * item.qty),
            0
        );

        res.render('cart', { cartItems, totalPrice });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading cart');
    }
}




async function BuyNowPage(req, res) {
    try {
        const product = await PRODUCT.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');


        res.render('buy', {
            message: "Your order has been placed and will arrive by tomorrow!",
            checkmark: "/images/checkmark.png"
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error buying product');
    }
}
async function RenderBuyPage(req, res) {
    res.render('buy', {
        message: "Your order has been placed and will arrive by tomorrow!",
        checkmark: ""
    })
}

async function CartRemover(req, res) {
    try {
        const user = await USER.findById(req.User._id);
        if (!user) return res.redirect('/login');

        user.cart = user.cart.filter(item => !item.productId.equals(req.params.id));
        await user.save();

        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing item from cart');
    }
}
async function RenderProfile(req, res) {
    try {
        const user = await USER.findById(req.User._id);
        if (!user) return res.redirect('/login');

        res.render('profile', {
            username: user.username,
            email: user.email
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading profile');
    }
}
async function LogoutPage(req, res) {
    res.clearCookie('uid', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    });
    res.redirect('/login');
}




function RenderWebPage(req, res) {
    return res.render('web')
}
module.exports = {
    RenderSignupPage,
    SignupPageCreateUser,
    RenderLoginPage,
    LoginCheck,
    RenderWebPage,
    ProductsFrontend,
    AddToCart,
    RenderCart,
    BuyNowPage,
    CartRemover,
    RenderProfile,
    LogoutPage,
    RenderBuyPage
}