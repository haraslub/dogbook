'use strict'

const { expect } = require('chai')
const request = require('supertest-koa-agent')

const app = require('../../../src/app')
const errors = require('../../../src/utils/errors')
const { resetDb } = require('../../helpers')
const { verifyTokenPayload } = require('../../../src/operations/users')
const { updateUser } = require('../../../src/repositories/users')
// const operations = require('../../../src/operations/users')

describe('Users', () => {

  beforeEach(resetDb)

  const endpoint = '/users/login'

  context((`POST ${endpoint}`), () => {
    
    const userData = {
      name: 'Lubos',
      email: 'lubos@example.com',
    }

    beforeEach(async () => {
      const res = await request(app)
        .post('/users')
        .send({
          ...userData,
          password: '123456789'
        })
        .expect(201)
        
    })

    context('Test verifyTokenPayload', () => {
        
      it('should return an Unauthorized Error - invalid access token', async () => {

        const res = await request(app)
          .post(`${endpoint}`)
          .send({
            email: userData.email,
            password: '123456789'
          })
          .expect(201)
  
        let user = res.body
        user.accessToken = '1234567890987654321QWASYXerdfcvTZGHBN'
        
        // NOTE: async function needs to be wrapped into try/catch
        try {
          await verifyTokenPayload(user)
        } catch (err) {
          expect(err.name).to.equal('UnauthorizedError')
          expect(err.message).to.equal('Site access denied.')
        }
      })

      it('should return an Unauthorized Error - disabled user', async () => {

        const res = await request(app)
          .post(`${endpoint}`)
          .send({
            email: userData.email,
            password: '123456789'
          })
          .expect(201)
        
        const updatedUser = await updateUser(res.body.id, {'disabled': true})
        updatedUser.accessToken = res.body.accessToken

        // NOTE: async function needs to be wrapped into try/catch
        try {
          await verifyTokenPayload(updatedUser)
        } catch (err) {
          expect(err.name).to.equal('UnauthorizedError')
          expect(err.message).to.equal('User does not exists or has been disabled.')
        }
      })

    })

    it('returns existing user after successful login', async () => {
      const res = await request(app)
        .post(`${endpoint}`)
        .send({
          email: userData.email,
          password: '123456789'
        })
        .expect(201)

      expect(res.body).to.have.all.keys([
        'name',
        'email',
        'password',
        'accessToken',
        'id',
        'disabled',
        'createdAt',
        'updatedAt',
      ])
    })

    it('responds with and error when password is incorrect', async () => {
        
      const res = await request(app)
        .post(`${endpoint}`)
        .send({
          email: userData.email,
          password: '111111111',
        })
        .expect(401)
    
      expect(res.body).includes.keys([
        'message',
        'type'
      ])
    })

    it('responds with and error when non existing user', async () => {

      const res = await request(app)
        .post(`${endpoint}`)
        .send({
          email: 'non-existing@user.com',
          password: '111111111'
        })
        .expect(404)

      expect(res.body).includes.keys([
        'message',
        'type'
      ])
      
      console.log(res.body.message)
      expect(res.body.message).to.equals('User does not exist.')
    })
  })
})