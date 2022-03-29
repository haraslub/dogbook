'use strict'

const errors = require('../utils/errors')
const { Dog } = require('../databases/models')

function getAll() {
  return Dog.query()
}

async function findById(id) {
  const dog = await Dog.query().findById(id)

  if (!dog) {
    throw new errors.NotFoundError()
  }
  return dog
}

async function createDog(dogAttributes) {
  const dog = await Dog.query().insertAndFetch(dogAttributes)
  return dog
}

module.exports = {
  getAll,
  findById,
  createDog,
}