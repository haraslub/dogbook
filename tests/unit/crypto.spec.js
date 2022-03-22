'use strict'

const assert = require('assert')
const { generateAccessToken, verifyAccessToken } = require('../../src/utils/crypto')

describe('Crypto', () => {
  it('generateAccessToken', async () => {
    const token = await generateAccessToken(2)
    const payload = await verifyAccessToken(token)
    
    console.log(payload)

    assert.strictEqual(2, payload.userId)
  })
})