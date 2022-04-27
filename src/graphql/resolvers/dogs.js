'use strict'

const operations = require('../../operations/dogs')

module.exports = {
  Query: {
    dogs: () => operations.getAll(),
  },
}