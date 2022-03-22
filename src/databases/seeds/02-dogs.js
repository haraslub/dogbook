'use strict'

const dogs = require('../dogs.json')
const users = require('../users.json')

exports.seed = async function(knex) {

  // Deletes ALL existing entries
  await knex('dogs').del()

  // Seed data:
  for (const item of dogs) {
    await knex('dogs').insert([
      {
        id: item.id,
        name: item.name,
        breed: item.breed,
        birth_year: item.birthYear,
        photo: item.photo,
        // assign "randomly" userId
        user_id: Math.floor(Math.random() * users.length) + 1
      }
    ])
  }

}

