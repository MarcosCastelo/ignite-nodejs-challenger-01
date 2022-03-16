const request = require('supertest');
const { validate } = require('uuid');

const app = require('../');

const createUser = async(name, username) => {
    const response = await request(app)
        .post('/users')
        .send({
            name,
            username
        });
    return response;
}

const createTodo = async(title, deadline, username) => {
    const response = await request(app)
        .post('/todos')
        .send({
            title,
            deadline
        })
        .set('username', username);

    return response;
}

describe('Todos', () => {
    it("should be able to create a new todo", async() => {
        const userResponse = await createUser('John Doe', 'user1');

        const todoDate = new Date();
        const todoResponse = await createTodo('test todo', todoDate, (await userResponse).body.username)
        expect(201);

        expect(todoResponse.body).toMatchObject({
            title: 'test todo',
            deadline: todoDate.toISOString(),
            done: false
        })

        expect(validate(todoResponse.body.id)).toBe(true);
        expect(todoResponse.body.created_at).toBeTruthy();

    });

    it("should be able to update a todo", async() => {
        const userResponse = await createUser('John Doe', 'user2');
        const todoDate = new Date();
        const todoResponse = await createTodo('test todo', todoDate, userResponse.body.username);

        const updateResponse = await request(app)
            .put(`/todos/${todoResponse.body.id}`)
            .send({
                title: 'update title',
                deadline: todoDate
            })
            .set('username', userResponse.body.username);

        expect(updateResponse.body).toMatchObject({
            title: 'update title',
            deadline: todoDate.toISOString(),
            done: false
        });

        const getAllTodosResponse = await request(app)
            .get('/todos')
            .set('username', userResponse.body.username);

        const updatedTodo = getAllTodosResponse.body.find((todo) => todo.id === todoResponse.body.id)

        expect(updatedTodo).toMatchObject({
            title: 'update title',
            deadline: todoDate.toISOString(),
            done: false
        })
    });

})