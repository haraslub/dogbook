'use strict'

const log = require('../utils/logger')
const userRepository = require('../repositories/users')
const errors = require('../utils/errors')
const crypto = require('../utils/crypto')

async function signUp(input) {
  // should not be in production environment as password is going to be printed into console!
  log.info({ name: input.name, email: input.email, }, 'signUp') 
    
  const user = {
    name: input.name,
    email: input.email.toLowerCase(),
    password: await crypto.hashPassword(input.password),
    disabled: false,
  }

  let alreadyExists
  // if user is not found by an email, the function 'findByEmail' will return an error, thus try/catch block to keep signUp working
  try {
    alreadyExists = await userRepository.findByEmail(user.email)
  } catch(err) {
    if (!(err instanceof errors.NotFoundError)) { throw new err }
  }

  if (alreadyExists) {
    throw new errors.ConflictError('User already exists.')
  }

  const newUser = await userRepository.create(user)
  newUser.accessToken = await crypto.generateAccessToken(newUser.id)

  log.info(`signUp of the user: "${input.name}" was successful.`)

  return newUser
}

async function logIn(input) {
  log.info({ email: input.email, }, 'logIn')

  const user = {
    email: input.email,
    password: input.password,
  }

  let existingUser

  try {
    existingUser = await userRepository.findByEmail(user.email)
  } catch(err) {
    if (err instanceof errors.NotFoundError) {
      throw new errors.NotFoundError('User does not exist.')
    }   
  }

  const cipheredPassword = existingUser.password
  const passwordMatched = await crypto.comparePasswords(input.password, cipheredPassword)

  if (!passwordMatched) {
    throw new errors.UnauthorizedError('Invalid log in')
  }

  existingUser.accessToken = await crypto.generateAccessToken(existingUser.id)

  log.info(`logIn of "${existingUser.name}" successful`)

  return existingUser
}

async function verifyTokenPayload(input) {
  // do not use logging of sensitive data in production!!! 
  log.info('verifyTokenPayload')
  
  const jwtToken = input.jwtToken || input.accessToken // not ideal
  // check if payload exists and login timeout has not expired yet
  const jwtPayload = await crypto.verifyAccessToken(jwtToken)
  const now = Date.now() // in mil seconds

  if (!jwtPayload || !jwtPayload.exp || now >= (jwtPayload.exp * 1000)) {
    throw new errors.UnauthorizedError('Site access denied.')
  }

  // check if user is in databases and is not disabled
  const userId = await parseInt(jwtPayload.userId)
  const user = await userRepository.findById(userId)

  if (!user || user.disabled) {
    throw new errors.UnauthorizedError('User does not exists or has been disabled.')
  }

  log.info('verifyTokenPayload successful')

  return {
    user,
    loginTimeout : jwtPayload.exp * 1000,
  }
}

async function getById(id) {
  const user = await userRepository.findById(id)
  if (!user) {
    throw new errors.NotFoundError()
  }

  return user
}

async function getByIds(ids) {
  const users = await userRepository.findByIds(ids)
  if (!users) {
    throw new errors.NotFoundError()
  }

  return users
}

module.exports = {
  signUp,
  logIn,
  verifyTokenPayload,
  getById,
  getByIds,
}