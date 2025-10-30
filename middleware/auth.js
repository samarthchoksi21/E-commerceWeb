const { getUser } = require('../service/auth')
async function RestrictLoggedUser(req, res, next) {
    const token = req.cookies.uid
    if (!token) return res.redirect('/login')
    const user = await getUser(token)
    if (!user) return res.redirect('/login')

    req.User = user
    next()

}
module.exports = {
    RestrictLoggedUser
}