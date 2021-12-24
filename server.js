const express = require('express')
const connectDB = require("./config/db")

const app = express()

connectDB()

app.use(express.json({ exdended: false }))

app.get('/', (req, res) => res.send('Hello babes'))

app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/users'))

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`App running on port ${PORT}`))