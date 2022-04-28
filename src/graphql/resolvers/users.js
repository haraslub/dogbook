'use strict'

const operations = require('../../operations/users')

module.exports = {
  Mutation: {
    login: (root, args) => operations.logIn(args.input)
  }
}