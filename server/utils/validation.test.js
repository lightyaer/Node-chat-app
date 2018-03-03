/* global it, describe */
const expect = require('expect')
const { isRealString } = require('./validation')


describe('isRealString', () => {
    it('should reject non-string values', () => {
        var str = 123
        var res = isRealString(str)
        expect(res).toBe(false)
    })

    it('should reject string with only spaces', () => {
        var str = '    '
        var res = isRealString(str)
        expect(res).toBe(false)
    })

    it('should allow string with spaces values', () => {
        var str = '  Hi! There  '
        var res = isRealString(str)
        expect(res).toBe(true)
    })
})