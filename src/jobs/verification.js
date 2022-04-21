'use strict'

const Bull = require('Bull')
const config = require('../config')
const log = require('../utils/logger')
const rekognition = require('../services/rekognition')
const dogOperations = require('../operations/dogs')

const queue = new Bull('Image verification', {
  redis: config.jobs.redisUrl
})

const execute = () => {
  log.info('Verification job started')

  queue.process(async job => {
    const { id, url } = job.data

    log.info('Starting photo recognition')

    const dog = dogOperations.updateDog(id, {
      photoVerified: await rekognition.isDogRecognized(url),
    })

    log.info({ dog })
  })
}

const add = (id, url) => {
  queue.add({ id, url })
}

module.exports = {
  execute,
  add,
}