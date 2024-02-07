const createError = require('http-errors')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const friend = require('../models/friend')
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
            const user = await User.findOne({ $or: [{ email: req.body.username }, { phone: req.body.username }] })
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
            res.cookie('jwt', '', { maxAge: 0 })

            res.send({
                message: 'success'
            })
        } catch (error) {
            next(error)
        }
    },
    user: async (req, res, next) => {
        try {
            const cookie = req.cookies['jwt']

            const claims = jwt.verify(cookie, 'secret')

            if (!claims) {
                return res.status(401).send({
                    message: 'unauthenticated'
                })
            }

            const user = await User.findOne({ _id: claims._id })

            const { password, ...data } = user.toJSON()

            res.send(data)
        } catch (e) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }
    },
    addfriend : async (req, res,next) => {
        const { userId, friendId , friendName } = req.body;

        try {
            const currentUser = await User.findOne({ _id : userId })
            const isuser = await User.findOne({ $or: [{ email: friendId }, { phone: friendId }] })
            const isFriend = await friend.findOne({$or : [{$and : [{'friendList.friendName' : friendName} , {'friendList.isFriend' : true}]} ,{$and : [{'friendList.friendUserName' : friendId} , {'friendList.isFriend' : true}]}]})
            if(isFriend)
                return createError[404]('user already exist with username/friendname')
            if (!isuser) 
                return createError[404]('user not found')
                const mainUser = await friend.findOneAndUpdate(
                    { id: currentUser._id }, 
                    {
                        $push: {
                            friendList: {
                                friendName: friendName,
                                friendUserName: friendId,
                                isFriend :true
                            },
                        },
                    },
                    { new: true, upsert: true } // Create a new user if not found
                );
                const friendFriends = await friend.findOneAndUpdate(
                    { id: isuser._id },
                    { $push: { friendList: { friendName: currentUser.name, friendUserName: currentUser.email, isFriend: false } } },
                    { upsert: true, new: true }
                );
             res.json({ success: true, message: 'Friend added successfully', mainUser });
          
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

}