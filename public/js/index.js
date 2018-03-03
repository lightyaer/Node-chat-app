/* global io , jQuery , moment */
var socket = io()

socket.on('connect', function () {
    console.log('Connected to Server')
})

socket.on('disconnect', function () {
    console.log('Disconnected from Server')
})

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    console.log(message)
    var li = jQuery('<li></li>')
    li.text(`${formattedTime} ${message.from} : ${message.text}`)
    jQuery('#messages').append(li)
})


var messageTextBox = jQuery('[name=message]')


jQuery('#messageForm').on('submit', function (e) {

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

    locationButton.attr('disabled','disabled').text('Sending Location...')
    
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
    var li = jQuery('<li></li>')
    var a = jQuery('<a target="_blank">My Current Location</a>')

    li.text(`${formattedTime} ${message.from} : `)
    a.attr('href', message.url)
    li.append(a)
    jQuery('#messages').append(li)
})


// socket.emit('createMessage', {
//     from: 'Dhananjay',
//     text: 'Demo Message Here'
// }, function (data) {
//     console.log('Message Delivered', data)
// })
