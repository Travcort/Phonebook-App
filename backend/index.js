let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const express = require('express');
const app = express();
app.use(express.json());
let morgan = require('morgan');
app.use(express.static('dist'));

const format = ':method :url :status :res[content-length] - :response-time ms :data'

morgan.token('data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body): '';
})

app.use(morgan(format));

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

app.get('/', (request,response) => {
    response.send('<h1>Hello Tarv!</h1>')
})

app.get('/api/persons', (request,response) => {
    response.json(phonebook)
})

app.get('/info', (request,response) => {
    const currentTime = new Date().toUTCString();
    const people = String(phonebook.length);
    response.send(`<p>Phonebook has info for ${people} people</p><p>${currentTime}</p>`);
})

app.get('/api/persons/:id', (request,response) => {
    const id = request.params.id;
    const person = phonebook.find(p => p.id === id);
    if(!person) {
        return response.status(404).json({error: 'The selected ID does not exist on the server'});
    }
    else {
        response.json(person);
    }
});

app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id;
    phonebook = phonebook.filter(p => p.id !== id);
    response.status(204).end();
});

const generateId = () => {
    return Math.floor(Math.random() * 1e6);
};

app.post('/api/persons', (request,response) => {
    const body = request.body

    if ((!body.name) || (!body.number)) {
        return response.status(400).json({error: 'Please input both the name and number'});
    }

    const nameExists = phonebook.some(p => p.name === body.name);
    if (nameExists) {
        return response.status(400).json({error: 'Name must be unique!'});
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(newPerson);
    response.json(newPerson);
});

const unknownEndpoint = (request,response) => {
    return response.status(404).send({error: 'unknown endpoint'});
}
app.use(unknownEndpoint)

