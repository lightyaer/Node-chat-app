const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const { generateMessage, generateLocationMessage } = require('../server/utils/message')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
var app = express()
var server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New User Connected')

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat Room'))

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'))

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message)
        io.emit('newMessage', generateMessage(message.from, message.text))
        callback()
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    })

    socket.on('disconnect', () => {
        console.log('Disconnected from User')
    })
})


server.listen(port, () => {
    console.log(`Server Started on port ${port}`)
})

