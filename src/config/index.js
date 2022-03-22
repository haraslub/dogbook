'use strict'

const env = process.env.NODE_ENV || 'local'

// Load process.env variable from .env file (when developing locally)
if (env === 'local') {
  require('dotenv').config({ silent: false })
}

const R = require('ramda')

// dynamic requires here to ensure that .env is loaded beforehand
const envConfigPath = `./env/${env}`
const envConfig = require(envConfigPath)
const defaultConfig = require('./default')(env)

// Override default values with values from env config
const resultConfig = R.mergeDeepRight(defaultConfig, envConfig)

module.exports = {
  resultConfig,
}