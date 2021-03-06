'use strict'

const { expect } = require('chai')
const request = require('supertest-koa-agent')
const sinon = require('sinon')

const app = require('../../../src/app')
const dogsRepo = require('../../../src/repositories/dogs')
const { resetDb } = require('../../helpers')
const dogApi = require('../../../src/services/dogApi')
const rekognition = require('../../../src/services/rekognition')

const sandbox = sinon.createSandbox()

describe('Dogs', () => {

  beforeEach(resetDb)

  const userData = {
    name: 'Lubos',
    email: 'lubos@example.com',
  }
  // console.log('\ndb reset successful')

  context('POST and GET /dogs', () => {

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
      
      sandbox.stub(dogApi, 'getRandomBreedImage').returns(Promise.resolve('https://mydogapi.io/breed/random'))
      // console.log(`\nCreating user successful\nJWT token ${userToken}`)

      sandbox.stub(rekognition, 'isDogRecognized').returns(Promise.resolve(true))
    })

    afterEach(() => sandbox.restore())

    it('POST and GET: responds with newly created dog, get all dogs, get a dog by ID', async () => {

      const dogData = {
        name: 'Azor',
        breed: 'chihuahua',
        birthYear: 2000,
      }

      // sinon.mock(dogApi)
      
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

      expect(res.body.photo).to.be.a('string')
      expect(res.body.photo).to.not.be.empty
 
      expect(res.body).to.have.all.keys([
        'name',
        'breed',
        'birthYear',
        'createdAt',
        'updatedAt',
        'userId',
        'photo',
        'id',
        'photoVerified',
      ])

      const allDogs = await dogsRepo.getAll()
      expect(allDogs.length).to.be.equal(1)

      const dog = await dogsRepo.findById(1)
      expect(dog.name).to.be.equal(dogData.name)

      try {
        await dogsRepo.findById(2)
      } catch (err) {
        expect(err.name).to.equal('NotFoundError')
        expect(err.message).to.equal('Dog has not been found.')
      }
    })

    it('spy the dogApi', async () => {
      sandbox.restore()

      let spy = sinon.spy(dogApi, 'getRandomBreedImage')

      const dogData = {
        name: 'Azor',
        breed: 'chihuahua',
        birthYear: 2000,
      }

      const res = await request(app)
        .post('/dogs')
        .set('Authorization', `jwt ${userToken}`)
        .send({
          ...dogData,
        })
        .expect(201)
      
      expect(spy.calledOnce).to.be.true
    })
  })
})