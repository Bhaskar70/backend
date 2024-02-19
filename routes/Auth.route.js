const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/Auth.Controller')

router.post('/register', AuthController.register)

router.post('/login', AuthController.login)

router.post('/addfriend', AuthController.addfriend)

router.delete('/logout', AuthController.logout)

router.get('/user' , AuthController.user)

router.get('/getfriends/:id' , AuthController.getfriends)

router.get('/getchats/:id' , AuthController.getchats)

module.exports = router



