'use strict'

module.exports = {
  hostname: 'http://locahost:3000',
  logger: {
    enabled: false,
    stdout: true,
    minLevel: 'debug',
  },
  database: {
    connection: 'postgres://postgres:password1234!@localhost:5432/nodejs-nights-test',
  },
}