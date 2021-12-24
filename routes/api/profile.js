const express = require("express")

const router = express.Router()

router.get('/', (req, res) => res.send("Profile Root"))

module.exports = router;