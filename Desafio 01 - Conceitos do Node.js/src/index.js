const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistUserAccount(request, response, next) {
    // TODO
}

app.post('/users', (request, response) => {
    const { name, username } = request.body;

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
    return response.json({
        users
    })
})

app.get('/todos', checksExistUserAccount, (request, response) => {
    // TODO
})

app.post('/todos', checksExistUserAccount, (request, response) => {
    // TODO
})

app.put('/todos/:id', checksExistUserAccount, (request, response) => {
    // TODO
})

app.patch('/todos/:id/done', checksExistUserAccount, (request, response) => {
    // TODO
})

app.delete('/todos/:id', checksExistUserAccount, (request, response) => {
    // TODO
})

module.exports = app;