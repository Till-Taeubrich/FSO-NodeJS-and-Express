const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { default: mongoose } = require('mongoose')

const app = express()
const port = process.env.PORT || 3001

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

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
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {

  Person.find({}).then(person => {
    response.send(`<div>Phonebook has info for ${person.length} people</div> <div>${new Date()}</div>`)
  })

})

app.get('/api/persons/:id', (request, response, err) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.send(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(res => {
      response.status(204).end()
    })
    .catch(err => {
      next(err)
    })
})

app.post('/api/persons', (request, response, next) => {

  const data = request.body;

  const newPerson = new Person({
    name: data.name,
    number: data.number,
  })

  newPerson.save()
    .then(() => {
    mongoose.connection.close()
    response.json(newPerson)
    })
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {

  const newNumber = request.body.number;

  const newPersonData = {
    number: newNumber 
  }

  Person.findByIdAndUpdate(request.params.id, newPersonData, { new: true })
    .then((res) => {
      response.json(res)
    })
    .catch(err => next(err))

})

app.use(errorHandler)