var socket = io();

socket.on('connect', function () {
    console.log('Connected to Server');


    socket.emit('createMessage', {
        from: 'Jane',
        text: 'Nothing much!'
    })
});

socket.on('disconnect', function () {
    console.log('Disconnected from Server');
});


socket.on('newMessage', function (message) {
    console.log(message);
})
