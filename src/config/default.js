'use strict'

const pkg = require('../../package')

module.exports = env => ({
  env,
  appName: pkg.name,
  version: pkg.version,
  server: {
    port: process.env.PORT || 3001,
    bodyParser: {
      patchKoa: true,
      urlencoded: true,
      text: false,
      json: true,
      multipart: false,
    },
    cors: {
      origin: '*',
      exposeHeaders: [
        'Authorization',
        'Content-Language',
        'Content-Length',
        'Content-Type',
        'Date',
        'ETag',
      ],
      maxAge: 3600,
    },
  },
  auth: {
    secret: process.env.AUTH_SECRET || 'nnfui3fb34ubfui3ebcuibsjcbwjkbwwysv8qvczq576',
    saltRounds: 10,
    createOptions: {
      expiresIn: 60 * 60,
      algorithm: 'HS256',
      issuer: `com.strv.nodejs-nights.${env}`,
    },
    verifyOptions: {
      algorithm: 'HS256',
      issuer: `com.strv.nodejs-nights.${env}`,
    }
  },
  logger: {
    stdout: true,
    minLevel: 'warning',
  },
  database: {
    client: 'pg', // was added for Objection.js purposes;
    // connection: {
    //   database: 'nodejs-nights-local', user: 'postgres', password: 'password1234!',
    // },
    // OR:
    connection: {
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:password1234!@localhost:5432/nodejs-nights-local',
      ssl: process.env.DATABASE_URL ? true : false,
    },
    pool: {
      min: process.env.DATABASE_POOL_MIN || 0,
      max: process.env.DATABASE_POOL_MAX || 5,
    },
  },
  jobs: {
    redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
  },
  aws: {
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
    rekognition: {
      minConfidence: 90,
    },
  },
})