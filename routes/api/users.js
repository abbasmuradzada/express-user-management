const express = require("express")
const { check, validationResult } = require('express-validator');
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.post('/', [
    check('name', 'please enter name').not().isEmpty(),
    check('password', 'Password must be at least 6 character').isLength({ min: 6 }),
    check('email', 'enter valid email').isEmail(),
    
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body

    console.log("credentials are ", name, email, password);

    try {
        let user = await User.findOne({ email: email })

        // console.log("finded user is ", user);

        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists" }] })
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            password,
            // avatar
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()

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