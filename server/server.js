const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const { generateMessage, generateLocationMessage } = require('../server/utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New User Connected')

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room Name are required')
        }
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room))

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat Room'))

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} Joined`))

    })

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id)
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
        }
        callback()
    })

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id)
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
        var user = users.removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
        }
    })
})

server.listen(port, () => {
    console.log(`Server Started on port ${port}`)
})

