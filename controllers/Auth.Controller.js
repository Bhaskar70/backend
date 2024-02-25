const createError = require('http-errors')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const friend = require('../models/friend')
const chats = require('../models/chats')
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
                maxAge: 900000, 
                httpOnly: true, 
                secure: true, // Ensure cookie is only sent over HTTPS
                sameSite: 'None' 
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
    addfriend: async (req, res, next) => {
        const { userId, friendId, friendName ,chatId} = req.body;

        try {
            const currentUser = await User.findOne({ _id: userId })
            const isuser = await User.findOne({ $or: [{ email: friendId }, { phone: friendId }] })
            const isFriend = await friend.findOne({ $or: [{ $and: [{ 'friendList.friendName': friendName }, { 'friendList.isFriend': true }] }, { $and: [{ 'friendList.friendUserName': friendId }, { 'friendList.isFriend': true }] }] })
            console.log(userId, friendId, friendName)
            if (isFriend)
                throw createError[404]('user already exist with username/friendname')
            if (!isuser)
                throw createError[404]('user not found')
            const mainUser = await friend.findOneAndUpdate(
                { id: currentUser._id },
                {
                    $push: {
                        friendList: {
                            friendName: friendName,
                            friendUserName: friendId,
                            isFriend: true,
                            chatId :chatId
                        },
                    },
                },
                { new: true, upsert: true }
            );
            const friendFriends = await friend.findOneAndUpdate(
                { id: isuser._id },
                { $push: { friendList: { friendName: currentUser.name, friendUserName: currentUser.email, isFriend: false ,chatId :chatId} } },
                { upsert: true, new: true }
            );
            res.json(mainUser);

        } catch (error) {
            next(error)
        }
    },
    getfriends: async (req, res, next) => {
        try {
            const id = req.params.id
            const friendslist = await friend.findOne({ id: id })
            res.json(friendslist)
        } catch (error) {
            next(error)
        }
    },
    getchats :async(req,res,next)=>{
        try{
            const id = req.params.id
            const chatdata = await chats.findOne({id})
            res.json(chatdata)
        }catch(error){
            next(error)
        }
    }
}