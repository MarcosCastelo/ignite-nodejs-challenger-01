const request = require('supertest');
const { validate } = require('uuid');

const app = require('../');

const createUser = async(name, username) => {
    const response = await request(app)
        .post('/users')
        .send({
            name,
            username
        })
    return response
}

describe('Users', () => {
    it('should be able to create a new user', async() => {
        const user1 = await createUser('John Doe', 'johndoe');
        const user2 = await createUser('Marcos Castelo', 'mcastelo');
        const allUsers = await request(app).get('/users')

        expect(201);
        expect(validate(user1.body.id)).toBe(true);

        expect(user1.body).toMatchObject({
            name: 'John Doe',
            username: 'johndoe',
            todos: []
        })

        expect(user2.body).toMatchObject({
            name: 'Marcos Castelo',
            username: 'mcastelo',
            todos: []
        });

        expect(allUsers.body.users.length).toBe(2);
    })
})