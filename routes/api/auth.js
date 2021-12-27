const express = require("express")
const auth = require('../../middleware/auth')
const User = require("../../models/User")
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');
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

router.post('/', [
    check('password', 'Password is required').exists(),
    check('email', 'enter valid email').isEmail(),
    
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body

    console.log("credentials are ", email, password);

    try {
        let user = await User.findOne({ email: email })

        // console.log("finded user is ", user);

        if (!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            (err, token) => {
                if (err) throw err
                res.json({accessToken: token})
            }
        )   
    } catch (error) {
        res.status(500).send('Server Error')
    }
})

module.exports = router;