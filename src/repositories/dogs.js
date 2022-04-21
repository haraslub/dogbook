'use strict'

const errors = require('../utils/errors')
const { Dog } = require('../databases/models')

function getAll() {
  return Dog.query()
}

async function findById(id) {
  const dog = await Dog.query().findById(id)

  if (!dog) {
    throw new errors.NotFoundError('Dog has not been found.')
  }
  return dog
}

async function create(dogAttributes) {
  const dog = await Dog.query().insertAndFetch(dogAttributes)
  return dog
}

function patchById(id, attributes) {
  return Dog.query().patch(id, attributes)
}

module.exports = {
  getAll,
  findById,
  create,
  patchById,
}