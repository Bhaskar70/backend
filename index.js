const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('./helper/mongoose')
const routes = require('./routes/Auth.route')

app = express()
let http = require('http');
let server = http.Server(app);
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
}))

app.use(express.json())
let socketIO = require('socket.io');
const chats = require('./models/chats')
let io = socketIO(server);
io.on('connection', async (socket) => {
    socket.on('message', async (data) => {
        console.log(data)
        const message = await chats.findOneAndUpdate(
            { id: data.id },
            {
                $push: {
                  chats : {...data.chat}
                },
            },
            { new: true, upsert: true }
        );
        io.emit('new message', {...data.chat});
    });
})
app.use('/api', routes)

server.listen(3000, () => {
    console.log(`server listening at 3000`)
})