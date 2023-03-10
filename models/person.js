require('dotenv').config()
const mongoose = require('mongoose');

const url = process.env.uri

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((err) => {
    console.log('error connecting to MongoDB', err)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: Number,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)