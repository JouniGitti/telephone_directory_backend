const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }

// komentoriviltä käynnmistettäessä
const password = process.argv[2]

const url =
`mongodb+srv://Jii_Koo_155:${password}@cluster0.sba3t.mongodb.net/people?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String, 
})

const Person = mongoose.model('Person', personSchema)

const listPersons = () => {
    Person.find({})
    .then(result => {
        console.log('Persons listed in the database:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}

const addPerson = (name, number) => {
    const person = new Person({name, number})
    person.save()
        .then(response => {
            console.log(name,' with number ', number, ' saved to database.')
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    listPersons()
  } else if (process.argv.length < 6) {
    const argumentName = process.argv[3]
    const argumentNumber = process.argv[4]
    addPerson(argumentName, argumentNumber)
  } else {
      console.log ('check the number of command line arguments!')
      console.log('numer of args:', process.argv.length)
      process.exit(1)
  }



// else if (process.argv.length === 3) {
//     const password = process.argv[2]
//     const argumentName = process.argv[3]
//     const argumentNumber = process.argv[4]
//     const randomId = Math.floor(Math.random() * 10000000)
//     const url =
//     `mongodb+srv://Jii_Koo_155:${password}@cluster0.sba3t.mongodb.net/note-app?retryWrites=true`
//   mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  
//   const personSchema = new mongoose.Schema({
//     name: String,
//     number: String,
//     id: Number
//   })

//   const Person = mongoose.model('Person', personSchema)

//   const person = new Person({
//       name: argumentName,
//       number: argumentNumber,
//       id: randomId
//   })

//   Person.find({}).then(result => {
//     result.forEach(person => {
//       console.log(person)
//     })
//     mongoose.connection.close()
//   })