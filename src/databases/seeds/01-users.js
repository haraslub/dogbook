'use strict'

const users = require('../users.json')

exports.seed = async function(knex) {

  // Deletes ALL existing entries
  await knex('users').del()

  // Seed data:
  for (const item of users) {
    await knex('users').insert([
      {
        id: item.id,
        name: item.name,
        email: item.email,
        password: item.password,
        disabled: item.disabled
      }
    ])
    
  }
}

