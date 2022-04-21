'use strict'

/**
  * The commented out lines of code needed to be replaced by the following ones in order to 
  * have mocking working (see the repository: ./../../tests/integration/dogs/create.spec.js)
  */

// const { getRandomBreedImage } = require('./../services/dogApi')

const errors = require('../utils/errors')
const verificationJob = require('../jobs/verification')
const dogRepository = require('./../repositories/dogs')
const dogApi = require('../services/dogApi')
const log = require('../utils/logger')

function getAll() {
  return dogRepository.getAll()
}

async function needDog(id) {
  const dog = await dogRepository.findById(id)

  if (!dog) {
    throw new errors.NotFoundError()
  }

  return dog
}

function getById(input) {
  return needDog(input.id)
}

async function createDog(input) {
  log.info('Creating a new dog')

  if (!input.photo) {
    // input.photo = await getRandomBreedImage(input.breed)
    input.photo = await dogApi.getRandomBreedImage(input.breed)
  }

  const dog = await dogRepository.create(input)

  verificationJob.add(dog.id, input.photo)

  return dog
}

async function updateDog(id, input) {
  console.log(`Updating the dog with id: ${id}`)

  const dog = await needDog(id)

  return dogRepository.patchById(dog.id, input)
}

module.exports = {
  getAll,
  getById,
  createDog,
  updateDog,
}