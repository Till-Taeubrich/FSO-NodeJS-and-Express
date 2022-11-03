const express = require('express')
const morgan = require('morgan')


const app = express()
const port = 3001

app.use(express.json())

app.use(morgan('tiny'))

app.listen(port)

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.send(persons)
})

app.get('/info', (request, response) => {
  response.send(`<div>Phonebook has info for ${persons.length} people</div> <div>${new Date()}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (!person) {
    response.status(404).end()
  }
  response.send(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const data = request.body
  const personExists = persons.find(person => person.name === data.name)

  if (!data.name) {
    return response.status(404).json({
      error: 'name is missing'
    })
  }

  if (!data.number) {
    return response.status(404).json({
      error: 'number is missing'
    })
  }

  if (personExists) {
    return response.status(404).json({
      error: 'person already exists'
    })
  }

  const newPerson = {
    id: (Math.random() * 10000000),
    name: data.name,
    number: data.number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})