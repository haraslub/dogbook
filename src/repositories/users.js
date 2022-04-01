'use strict'

const errors = require('../utils/errors')
const { User } = require('../databases/models')

function findAll() {
  return User.query()
}

async function findById(id) {
  const user = await User.query().findById(id)
	
  if (!user) {
    throw new errors.NotFoundError()
  }
  return user
}

async function findByEmail(email) {
  const user = await User.query().where('email', email).first()
	
  if (!user) throw new errors.NotFoundError()

  return user
}

/**
 * Create a user
 * @param {Object} attributes User attributes
 * @param {String} attributes.email User email
 * @param {String} attributes.name User name
 * @param {String} attributes.password User password
 * @param {boolean} attributes.disabled User disabled flag
 * @return {Promise<User>}
 */

async function create(attributes) {
  const user = await User.query().insertAndFetch(attributes)
	
  return user
}

async function updateUser(userId, attributes) {
  
  if (!attributes || !userId) throw new errors.BadRequest('Missing required values')
  
  const updatedUser = await User.query()
    .patchAndFetchById(parseInt(userId), attributes)
  
  return updatedUser
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  updateUser,
}

// const users = require('../databases/users')
// const database = require('../databases')

// async function findAll() {
//   const query = await database.query('SELECT * FROM users')
//   return query.rows.map(row => userFromRow(row))
// }

// async function findById(id) {
//   const query = await database.query('SELECT * FROM users WHERE id = $1', {id})
//   const row = query.rows[0]

//   if (!row) {
//     throw new errors.NotFoundError()
//   }
//   return userFromRow(row)
// }

// async function findByEmail(email) {
//   const query = await database.query('SELECT * FROM users WHERE email = $1', {email})
//   const row = query.rows[0]
	
//   if (!row) {
//     throw new errors.NotFoundError()
//   }
//   return userFromRow(row)
// }

// async function create(attributes) {
//   // id will be created by the database, thus is not included in attributes
//   const insertInstruction = `
// 	INSERT INTO users(email, name, password, disabled, created_at, updated_at)
// 	VALUES ($1, $2, $3, $4, NOW(), NOW())
// 	RETURNING *
// 	`
//   const query = await database.query(insertInstruction, [
//     attributes.email,
//     attributes.name,
//     attributes.password,
//     attributes.disabled,
//   ])

//   return userFromRow(query.rows[0])
// } 

// function userFromRow(row) {
//   return {
//     id: row.id,
//     name: row.name,
//     password: row.password,
//     disabled: row.disabled,
//     createdAt: row.created_at,
//     updatedAt: row.updated_at,
//   }
// }