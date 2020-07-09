// to start the server: npm run dev (win cmd open in the directory)

const express = require('express')
const { response } = require('express')
const app = express()
const morgan = require('morgan')
morgan.token('body', function (req, res) {
    console.log('morganissa', req.body)
    return JSON.stringify(req.body)
  })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
      "name": "Aarne Aarnela",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Bertta Berttala",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Celsius Celsiusson",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Daavid Daavidsson",
      "number": "39-23-6423122",
      "id": 4
    }
  ]



app.get('/', (request, response) => {
    response.send('<h2>Hello hello!</h2>')
})

app.get('/info', (request, response) => {
    const phoneBookSize = persons.length
    const datum = new Date
    response.send(`The phonebook has info for ${phoneBookSize} people. <br/> ${datum}`)
    }
  )

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personFound = persons.find(person => person.id === id )
    if (personFound) { 
        response.send(personFound.number)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generatedId = () => {
    const randomId = Math.floor(Math.random() * 10000000)
    return randomId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const nameAlreadyExists = persons.find(person => person.name === body.name)
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } else if (nameAlreadyExists) {
        return response.status(409).json({
            error: 'Name is already in the phonebook'
        })
   }
    const person = {
        name: body.name,
        number: body.number,
        id: generatedId()
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
