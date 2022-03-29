'use strict'

const { validate } = require('./../validations/index')
const operations = require('../operations/users')
const schemas = require('../validations/schemas/users')

async function signUp(ctx) {
  const input = {
    name: ctx.request.body.name,
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  }

  validate(schemas.signUp, input)
  const user = await operations.signUp(input)
  ctx.status = 201
  ctx.body = user
}

async function logIn(ctx) {
  const input = {
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  }

  validate(schemas.logIn, input)
  const user = await operations.logIn(input)
  ctx.status = 201
  ctx.body = user
}

module.exports = {
  signUp,
  logIn,
}