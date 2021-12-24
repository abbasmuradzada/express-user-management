const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    // Get token from header
    const accessToken = req.header('x-auth-token')

    // If there is no any token
    if (!accessToken) {
        return res.status(401).json({ msg: "there is no any token" })
    }

    // Verify token
    try {
        const decoded = jwt.verify(accessToken, config.get('jwtSecret'));
        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: "token is not valid" })
    }
}