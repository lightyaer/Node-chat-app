const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.on('disconnect', () => {
        console.log('Disconnected from User')
    });

    socket.emit('newMessage', {
        from: 'Mike',
        text: 'Whats Up?'
    });



    socket.on('createMessage', (Message) => {
        console.log(Message);
    });
});


server.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});


