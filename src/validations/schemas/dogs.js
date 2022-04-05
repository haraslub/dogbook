'use strict'

const dogId = {
  type: 'Object',
  required: true,
  properties: {
    id: { type: 'Integer', required: true, min: 1, max: 100000 },
  },
}

const dog = {
  type: 'Object',
  required: true,
  properties: {
    name: { type: 'String', required: true },
    breed: { type: 'String', required: true },
    birthYear: { type: 'number' },
    photo: { type: 'String', format: 'Url' },
  },
}

module.exports = {
  dogId,
  dog,
}