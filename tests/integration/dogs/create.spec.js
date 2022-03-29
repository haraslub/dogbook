'use strict'

const { expect } = require('chai')
const request = require('supertest-koa-agent')

const app = require('../../../src/app')
const { resetDb } = require('../../helpers')
const userRepository = require('../../../src/repositories/users')

describe('Dogs', () => {

  beforeEach(resetDb)

  const userData = {
    name: 'Lubos',
    email: 'lubos@example.com',
  }
  console.log('\ndb reset successful')

  context('POST /dogs', () => {

    let userToken

    beforeEach(async () => {
      const res = await request(app)
        .post('/users')
        .send({
          ...userData,
          password: '123456789'
        })
        .expect(201)

      userToken = res.body.accessToken

      console.log(`\nCreating user successful\nJWT token ${userToken}`)
    })

    const dogData = {
      name: 'Azor',
      breed: 'chihuahua',
      birthYear: 2000,
    }

    it('responds with newly created dog', async () => {
      const res = await request(app)
        .post('/dogs')
        .set('Authorization', `jwt ${userToken}`)
        .send({
          ...dogData,
        })
        .expect(201)
    
      console.log(res.body)
 
      expect(res.body).to.deep.include({
        ...dogData,
      })
 
      expect(res.body).to.have.all.keys([
        'name',
        'breed',
        'birthYear',
        'createdAt',
        'updatedAt',
        'userId',
        'photo',
        'id',
      ])
    })
  })
})