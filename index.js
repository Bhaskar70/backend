const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')
let socketIO = require('socket.io');
const chats = require('./models/chats')
let http = require('http');
require('./helper/mongoose')
const routes = require('./routes/Auth.route')
app = express()
const corsOptions = {
    origin: 'https://bhaskar70.github.io',
    credentials: true,
};

app.use(cors(corsOptions));

let server = http.Server(app);
app.use(express.json())

app.use(cookieParser())


server.listen(3000, () => {
    console.log(`server listening at 3000`)
})
let io = socketIO(server);
io.on('connection', async (socket) => {
    // message sending
    socket.on('message', async (data) => {
        console.log(data)
        const message = await chats.findOneAndUpdate(
            { id: data.id },
            {
                $push: {
                    chats: { ...data.chat }
                },
            },
            { new: true, upsert: true }
        );
        io.emit('new message', { ...data.chat });
    });

    // user chat details
    socket.on('latestMessage', async (chatId) => {
        const chat = await chats.findOne({ id: chatId });
        const lastMessage = chat.chats[chat.chats.length - 1]; // Get the last message
        const unreadMessagesCount = chat.chats.filter(message => !message.read).length; // Count unread messages
        io.emit('userChatData', { lastMessage, unreadMessagesCount });
    })
})
app.use('/', routes)


