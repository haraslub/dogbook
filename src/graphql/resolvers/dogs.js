'use strict'

const dogsOperations = require('../../operations/dogs')
const usersOperations = require('../../operations/users')

module.exports = {
  Query: {
    dogs: (root, args, ctx) => {
      ctx.requireAuth()
      return dogsOperations.getAll()
    },
    dog: (root, args, ctx) => {
      ctx.requireAuth()
      return dogsOperations.getById({ id: args.id })
    },
  },
  Dog: {
    // user: dog => usersOperations.getById(dog.userId) // pure performance, it will shoot thousands requests
    user: (dog, args, ctx) => ctx.loaders.users.load(dog.userId), // once all queries are collected (dogs), then the loader is executed only once
  }
}