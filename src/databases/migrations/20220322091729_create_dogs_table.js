'use strict'

exports.up = function(knex) {
  return knex.schema.createTable('dogs', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('breed').notNullable()
    table.integer('birth_year').notNullable()
    table.string('photo')
    table.integer('user_id')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('dogs')
}

