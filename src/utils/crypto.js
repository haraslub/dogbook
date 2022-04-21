'use strict'

const util = require('util')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

const jwtSign = util.promisify(jwt.sign)
const jwtVerify = util.promisify(jwt.verify)

module.exports = {

  generateAccessToken(userId) {
    const payload = { userId }
    return jwtSign(payload, config.auth.secret, config.auth.createOptions)
  },

  async verifyAccessToken(accessToken) {
    try {
      // Don't return directly for catch block to work properly
      const data = await jwtVerify(accessToken, config.auth.secret, config.auth.verifyOptions)
      return data
      
    } catch(err) {
      // check if known error (jsw error or syntax error)
      if (err instanceof jwt.JsonWebTokenError || err instanceof SyntaxError) {
        return null
      }
      // this should not happen as error is not expected/mapped
      throw err
    }
  },

  hashPassword(password) {
    return bcrypt.hash(peperify(password), config.auth.saltRounds)
  },

  comparePasswords(plaintext, cipheredText) {
    return bcrypt.compare(peperify(plaintext), cipheredText)
  },
}

function peperify(password) {
  return crypto.createHmac('sha1', config.auth.secret).update(password).digest('hex')
}