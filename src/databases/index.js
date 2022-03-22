'use strict'
/**
 * WHEN USING OBJECTIONS / MIGRATIONS
 */
const objection = require('objection')
// Knex/PG issue: https://github.com/knex/knex/issues/927 
const pg = require('pg')

pg.types.setTypeParser(20, 'text', parseInt)
pg.types.setTypeParser(1700, 'text', parseFloat)
// -- end --

const knexLib = require('knex')
const R = require('ramda')
const config = require('../config')
const knexEnvConfig = require('./knexfile')[config.resultConfig.env]

const knexConfig = R.mergeDeepWith({}, knexEnvConfig, objection.knexSnakeCaseMappers())
const knex = knexLib(knexConfig)

const Model = objection.Model
Model.knex(knex)
const transaction = objection.transaction

function connect() {
  // Knex does not have an explicit '.connect()' method so we issue a query consider the
  // connection to be open once we get response back
  return knex.raw('select 1 + 1')
}

function close() {
  return knex.destroy()
}

module.exports = {
  Model,
  knex,
  transaction,
  connect,
  close,
}

// /**
//  * WHEN USING POSTGRES
//  */

// const pg = require('pg')

// pg.types.setTypeParser(20, 'text', parseInt)
// pg.types.setTypeParser(1700, 'text', parseFloat)

// const config = require('../config')
// const logger = require('../utils/logger')

// const { Pool } = pg
// const pool = new Pool ({
// 	connectionString: config.resultConfig.database.connection,
// })

// pool.on('error', err => {
// 	logger.error(err, 'Unexpected error on idle client')
// 	throw err
// })

// module.exports = {
// 	pool,
// 	query: (text, params) => pool.query(text, params),
// }

