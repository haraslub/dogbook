'use strict'

const Bull = require('Bull')
const config = require('../config')
const log = require('../utils/logger')

const queue = new Bull('test', {
  redis: config.resultConfig.jobs.redisUrl
})

const execute = () => {
  log.info('Test job started')
  queue.process(job => {
    log.info({ job })
  })
}

module.exports = {
  execute,
}