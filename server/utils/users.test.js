/* global it, describe,beforeEach */
const expect = require('expect')
const { Users } = require('./users')

var users

describe('Users', () => {

    beforeEach(() => {
        users = new Users()
        users.users = [{
            id: 1,
            name: 'Mike',
            room: 'Node'
        }, {
            id: 2,
            name: 'Jen',
            room: 'React'
        },
        {
            id: 3,
            name: 'Julie',
            room: 'Node'
        }]
    })

    it('should add new user', () => {
        var users = new Users()
        var user = {
            id: 123,
            name: 'DJ',
            room: 'Node Fans'
        }
        users.addUser(user.id, user.name, user.room)
        expect(users.users.pop()).toEqual(user)
    })

    it('should return names for room Node', () => {
        var userList = users.getUserList('Node')
        expect(userList).toEqual(['Mike', 'Julie'])
    })

    it('should return names for room React', () => {
        var userList = users.getUserList('React')
        expect(userList).toEqual(['Jen'])

    })


    it('should find a user', () => {
        var user = users.getUser(2)
        expect(user).toEqual(users.users[1])
    })


    it('should not find a user with invalid id', () => {
        var user = users.getUser(123)
        expect(user).toEqual(undefined)
    })


    it('should remove user from users', () => {

        var remUser = users.removeUser(2)
        expect(remUser).toEqual({ id: 2, name: 'Jen', room: 'React' })
    })

    it('should not remove a user from array on invalid id', () => {
        var remUser = users.removeUser(123)
        expect(remUser).toEqual(undefined)
    })

    it('should not allow duplicate users', () => {
        var user = users.users[1]
        var res = users.isDuplicateUser(user.name)
        expect(res).toBe(true)
    })

    it('should allow unique users', () => {
        var name = 'qwweert'
        var res = users.isDuplicateUser(name)
        expect(res).toBe(false)
    })



})