'use strict'

/**
  * The commented out lines of code needed to be replaced by the following ones in order to 
  * have mocking working (see the repository: ./../../tests/integration/dogs/create.spec.js)
  */

const dogRepository = require('./../repositories/dogs')
// const { getRandomBreedImage } = require('./../services/dogApi')
const dogApi = require('./../services/dogApi')

function getAll() {
  return dogRepository.getAll()
}

function getById(input) {
  return dogRepository.findById(input.id)
}

async function createDog(input) {
  if (!input.photo) {
    // input.photo = await getRandomBreedImage(input.breed)
    input.photo = await dogApi.getRandomBreedImage(input.breed)
  }
  return dogRepository.createDog(input)
}

module.exports = {
  getAll,
  getById,
  createDog,
}