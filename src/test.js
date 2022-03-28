'use strict'

const dogs = require('./databases/dogs.json')
const users = require('./databases/users.json')

for (const item of dogs) {
  console.log(item)
  console.log(Math.floor(Math.random() * users.length) + 1)
}