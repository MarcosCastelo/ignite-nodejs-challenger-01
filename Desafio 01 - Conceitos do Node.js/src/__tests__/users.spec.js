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
        const user = await createUser('John Doe', 'johndoe');
        const allUsers = await request(app).get('/users')

        expect(201);
        expect(validate(user.body.id)).toBe(true);

        expect(user.body).toMatchObject({
            name: 'John Doe',
            username: 'johndoe',
            todos: []
        })

        expect(allUsers.body.users.length).toBe(1);
    })

    it('should not be able to create a new user when username already exists', async() => {
        createUser('John Doe', 'johndoe');
        const response = await createUser('John Doe', 'johndoe');

        expect(400);
        expect(response.body.error).toBeTruthy();

    })
})