const mongoose = require('mongoose')

const friendList = new mongoose.Schema({
    friendName : {
        type: String,
        required: true,
        unqiue :true
    },
    friendUserName : {
        type : String ,
        required : true ,
        unqiue :true ,
    },
    isFriend :{
        type :Boolean ,
        required:true
    },
    chatId :{
        type:String ,
        required :true
    }
})
const friends = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    friendList : [friendList]
})

module.exports = mongoose.model('contactslists', friends)
