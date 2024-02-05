const createError = require('http-errors')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
module.exports = {
    register: async (req, res, next) => {
        try {
            const doesExist = await User.findOne({ email: result.email })
            if (doesExist)
              throw createError.Conflict(`${result.email} is already been registered`)

            const user = new User(result)
            const savedUser = await user.save()
            res.send(data)
        } catch (error) {
            next(error)
        }
    },

    login: async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.username })
            if (!user) {
                return res.status(404).send({
                    message: 'user not found'
                })
            }
            const isMatch = await user.isValidPassword(req.body.password)
            if (!isMatch)
              throw createError.Unauthorized('Username/password not valid')

            const token = jwt.sign({ _id: user._id }, "secret")

            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })

            res.send({
                message: 'success'
            })
        } catch (error) {
            next(error)
        }
    },

    logout: async (req, res, next) => {
        try {
            res.cookie('jwt', '', {maxAge: 0})

            res.send({
                message: 'success'
            })
        } catch (error) {
            next(error)
        }
    },
    user : async (req, res , next) => {
        try {
            const cookie = req.cookies['jwt']
    
            const claims = jwt.verify(cookie, 'secret')
    
            if (!claims) {
                return res.status(401).send({
                    message: 'unauthenticated'
                })
            }
    
            const user = await User.findOne({_id: claims._id})
    
            const {password, ...data} = user.toJSON()
    
            res.send(data)
        } catch (e) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }
    }
}