/* global it, describe */
var expect = require('expect')
var { generateMessage, generateLocationMessage } = require('./message')


describe('generateMessage', () => {
    it('should return a correct message object', () => {
        var from = 'Mike'
        var text = 'Hi! Whats Up?'
        var res = generateMessage(from, text)
        expect(res.from).toBe(from)
        expect(res.text).toBe(text)
        expect(typeof res.createdAt).toBe('string')

    })
})

describe('generateLocationMessage', () => {
    it('should generate correct Location Object', () => {
        var from = 'Jane'
        var lat = '11.2564658'
        var lng = '65.2165421'
        var url = 'https://google.com/maps?q=11.2564658,65.2165421'
        var res = generateLocationMessage(from, lat, lng)
        expect(res.from).toBe(from)
        expect(typeof res.createdAt).toBe('string')
        expect(res.url).toBe(url)

    })
})