'use strict'

const log = require('./utils/logger')

const worker = {}

worker.start = () => {
  log.info('Starting worker')
}

worker.stop = () => {
  log.info('Stopping worker')
}

if (require.main === module) {
  worker.start()
}

process.once('SIGINT', () => worker.stop())
process.once('SIGTERM', () => worker.stop())

module.exports = worker