const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistUserAccount(request, response, next) {
    const { username } = request.headers;

    const user = users.find(user => user.username === username);
    if (!user)
        response.status(400).json({ error: 'User not found' });

    request.user = user;
    return next();
}

function checksExistsTodo(request, response, next) {
    const id = request.params.id;
    const user = request.user;

    const todo = user.todos.find(todo => todo.id === id)
    if (!todo)
        response.status(404).json({ error: 'Todo not found' });

    request.todo = todo;
    return next();
}

app.post('/users', (request, response) => {
    const { name, username } = request.body;

    const alreadyExistsUsername = users.some(user => user.username === username);

    if (alreadyExistsUsername)
        response.status(400).json({ error: 'User already exists' });

    const user = {
        id: uuidv4(),
        name,
        username,
        todos: []
    }

    users.push(user);

    return response.status(201).json(user)
})

app.get('/users', (request, response) => {
    return response.json({ users })
})

app.get('/todos', checksExistUserAccount, (request, response) => {
    const user = request.user;
    response.json(user.todos);
})

app.post('/todos', checksExistUserAccount, (request, response) => {
    const { title, deadline } = request.body;
    const user = request.user;

    const todo = {
        id: uuidv4(),
        created_at: new Date(),
        title,
        deadline,
        done: false
    }

    user.todos.push(todo);
    response.status(201).json(todo);
})

app.put('/todos/:id', checksExistUserAccount, checksExistsTodo, (request, response) => {
    const user = request.user;
    const todo = request.todo;
    const { title, deadline } = request.body;

    todo.title = title;
    todo.deadline = deadline;

    response.json(todo)

})

app.patch('/todos/:id/done', checksExistUserAccount, (request, response) => {
    // TODO
})

app.delete('/todos/:id', checksExistUserAccount, checksExistsTodo, (request, response) => {
    const { user, todo } = request;
    user.todos.splice(todo, 1);
    response.status(204).json(user.todos)
})

module.exports = app;