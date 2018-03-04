/* global io , jQuery , moment , Mustache*/
var socket = io()

var scrollToBottom = function () {
    //selectors 
    var messages = jQuery('#messages')
    var newMessage = messages.children('li:last-child')

    // heights
    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight)
    }

}

socket.on('connect', function () {
    var param = jQuery.deparam(window.location.search)


    socket.emit('join', param, function (err) {
        if (err) {
            alert(err)
            window.location.href = '/'
        } else {
            console.log('No error')
        }
    })
    console.log('Connected to Server')
})

socket.on('disconnect', function () {
    console.log('Disconnected from Server')
})

socket.on('updateUsersList', function (users) {
    var ul = jQuery('<ul></ul>')
    users.forEach(function (user) {
        ul.append(jQuery('<li></li>').text(user))
    })

    jQuery('#users').html(ul)

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
    scrollToBottom()
})

jQuery('#messageForm').on('submit', function (e) {
    var messageTextBox = jQuery('[name=message]')
    e.preventDefault()
    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('')

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
    scrollToBottom()
})
