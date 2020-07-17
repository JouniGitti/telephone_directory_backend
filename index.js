// to start the server: npm run dev (win cmd open in the directory)
// https://enthousiaste-monsieur-26140.herokuapp.com/ 
// | https://git.heroku.com/enthousiaste-monsieur-26140.git
// backendissä: npm run build:ui  -tekee uuden buildin frontista ja kopioi sen backendiin
// npm run deploy -julkaisee herokuun
// npm run deploy:full -yhdistää nuo molemmat 
// sekä lisää vaadittavat git-komennot versionhallinnan päivittämistä varten
//  npm run logs:prod -lokien lukemiseen,

// front ja back toimivat yhdessä, frontista nimen lisääminen vie sen backin kautta tietokantaan
// delete ei vielä toimi

const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
// const morgan = require('morgan')
// morgan.token('body', function (req, res) {
//   return JSON.stringify(req.body)
// })
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h2>Phonebook backend</h2>')
})

app.get('/info', (request, response) => {
  const datum = new Date
  Person.countDocuments({}, function (err, result){
    if (err) {
      console.log('an error occurred when counting the size of db', err)
    } else {
      response.send(`The phonebook database has ${result} contacts. <br/> ${datum}`)
    }
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
  .then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  console.log('req params id', request.params.id)
  Person.findById(request.params.id)
  .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined) {
      return response.status(400)
      .json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'Id is formatted wrongly' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// let persons = [
//   {
//     "name": "Aarne Aarnela",
//     "number": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Bertta Berttala",
//     "number": "39-44-5323523",
//     "id": 2
//   },
//   {
//     "name": "Celsius Celsiusson",
//     "number": "12-43-234345",
//     "id": 3
//   },
//   {
//     "name": "Daavid Daavidsson",
//     "number": "39-23-6423122",
//     "id": 4
//   }
// ]