var expect = require('expect');
var { generateMessage } = require('./message');


describe('generateMessage', () => {
    it('should return a correct message object', () => {
        var from = 'Mike';
        var text = 'Hi! Whats Up?'
        var res = generateMessage(from, text)
        expect(res.from).toBe(from);
        expect(res.text).toBe(text);
        expect(typeof res.createdAt).toBe('number');

    });
});