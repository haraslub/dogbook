'use strict'

const { expect } = require('chai')
const request = require('supertest-koa-agent')

const app = require('../../../src/app')
const { resetDb } = require('../../helpers')
const userRepository = require('../../../src/repositories/users')

describe('POST /users', () => {

  beforeEach(resetDb)

  const userData = {
    name: 'Lubos',
    email: 'lubos@example.com',
  }

  it('should return a newly created user', async () => {

    const response = await request(app)
      .post('/users')
      .send({
        ...userData,
        password: '123456789',
      })
      .expect(201)
    
    // console.log(response.body)

    expect(response.body).to.deep.include({
      ...userData,
      disabled: false,
    })

    expect(response.body).to.have.all.keys([
      'name',
      'email',
      'password',
      'disabled',
      'createdAt',
      'updatedAt',
      'id',
      'accessToken'
    ])
  })

  it('responds with an error when not all required attributes are in body', async () => {

    const response = await request(app)
      .post('/users')
      .send({})
      .expect(400)
    
    // console.log(response.body)
    
    expect(response.body).includes.keys([
      'message',
      'type',
    ])
  })

  it('responds with error when email is already taken', async () => {

    await userRepository.create({
      ...userData,
      password: '123456789'
    })

    const response = await request(app)
      .post('/users')
      .send({
        ...userData,
        password: '111111111'
      })
      .expect(409)
    
    expect(response.body).includes.keys([
      'message',
      'type',
    ])
  })
})
