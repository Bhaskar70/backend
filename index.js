const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('./helper/mongoose')

const routes = require('./routes/Auth.route')

app = express()

app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
}))

app.use(express.json())

app.use('/api', routes)

app.listen(3000 , ()=>{
    console.log(`server listening at 3000`)
})