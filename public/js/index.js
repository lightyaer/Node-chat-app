var socket = io();

socket.on('connect', function () {
    console.log('Connected to Server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from Server');
});

socket.on('newMessage', function (message) {
    console.log(message);
    var li = jQuery('<li></li>');
    li.text(`${new Date(message.createdAt).toLocaleTimeString()} ${message.from} : ${message.text}`);
    jQuery('#messages').append(li);
});


jQuery('#messageForm').on('submit', function (e) {

    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        jQuery('[name=message]').val("");
        console.log('Message Delivered');
    });
});


// socket.emit('createMessage', {
//     from: 'Dhananjay',
//     text: 'Demo Message Here'
// }, function (data) {
//     console.log('Message Delivered', data);
// })
