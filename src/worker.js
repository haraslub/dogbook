'use strict'

const log = require('./utils/logger')
const verificationJob = require('./jobs/verification')

const worker = {}

worker.start = () => {
  log.info('Starting a worker')

  verificationJob.execute()
}

worker.stop = () => {
  log.info('Stopping a worker')
}

if (require.main === module) {
  worker.start()
}

process.once('SIGINT', () => worker.stop())
process.once('SIGTERM', () => worker.stop())

module.exports = worker