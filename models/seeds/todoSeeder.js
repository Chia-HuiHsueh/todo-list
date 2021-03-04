const bcrypt = require('bcryptjs')

if (process.env.NODE_EVN !== 'production') {
  require('dotenv').config()
}

const Todo = require('../todo')
const User = require('../user')
const db = require('../../config/mongoose')
const { Promise } = require('mongoose')

const SEED_UER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_UER.password, salt))
    .then(hash => User.create({
      name: SEED_UER.name,
      email: SEED_UER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 10 },
        (_, i) => Todo.create({ name: `name-${i}`, userId })
      ))
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})
