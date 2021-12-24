const express = require("express")
const auth = require('../../middleware/auth')
const User = require("../../models/User")

const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
    res.json(user)
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error")
    }
})

module.exports = router;