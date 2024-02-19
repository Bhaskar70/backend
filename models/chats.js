const mongoose = require('mongoose')

const chatsData =new mongoose.Schema({
    user : {
        type :String ,
        required :true
    }, 
    message : {
        type :String ,
        required :true
    },
    time : {
        type :String ,
        required :true
    },
     read : {
        type :Boolean,
        required :true
    },
     type : {
        type :String ,
        required :true
    }
})

const chats = new mongoose.Schema({
    id : {
        type :String ,
        required :true
    },
    chats : [chatsData]
})

module.exports = mongoose.model('chats' , chats)