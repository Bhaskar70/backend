const mongoose = require('mongoose')
require('dotenv')
mongoose
  .connect('mongodb+srv://bhaskar:r123r456@cluster0.pym3mcr.mongodb.net/?retryWrites=true&w=majority', {
    dbName: 'chat_db',
  })
  .then(() => {
    console.log('mongodb connected.')
  })
  .catch((err) => console.log(err.message))

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db')
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})