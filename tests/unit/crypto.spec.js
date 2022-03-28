'use strict'

// const assert = require('assert')
const { expect } = require('chai')
const { generateAccessToken, verifyAccessToken } = require('../../src/utils/crypto')

describe('Crypto', () => {
  it('generateAccessToken', async () => {
    const userId = 2
    const token = await generateAccessToken(userId)
    const payload = await verifyAccessToken(token)

    // assert.strictEqual(2, payload.userId)
    expect(payload).to.deep.include({ userId })
  })
})