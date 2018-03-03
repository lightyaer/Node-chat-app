/* global io , jQuery , moment , Mustache*/
var socket = io()

socket.on('connect', function () {
    console.log('Connected to Server')
})

socket.on('disconnect', function () {
    console.log('Disconnected from Server')
})

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#messageTemplate').html()
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    })
    jQuery('#messages').append(html)
})

jQuery('#messageForm').on('submit', function (e) {
    var messageTextBox = jQuery('[name=message]')
    e.preventDefault()
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('')
        console.log('Message Delivered')
    })
})

var locationButton = jQuery('#sendLocation')
locationButton.on('click', function () {

    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your Browser')
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...')

    navigator.geolocation.getCurrentPosition(function (position) {

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        locationButton.removeAttr('disabled').text('Send Location')
    }, function (err) {
        locationButton.removeAttr('disabled').text('Send Location')
        console.log(err)
        alert('Unable to fetch Location')
    })
})

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#locationMessageTemplate').html()
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    })
    jQuery('#messages').append(html)
})
