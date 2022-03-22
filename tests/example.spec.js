'use strict'

const assert = require('assert')

function multiplyBy4(val) {
  return val * 4
}

describe('Example', () => {
  it('multiplyBy4', () => {
    const result = multiplyBy4(2)
    const expectedResult = 8
    assert.strictEqual(result, expectedResult)
  })
})