'use strict'

const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaCors = require('kcors')
const koaHelmet = require('koa-helmet')
const router = require('./routes')
const config = require('./config')
const log = require('./utils/logger')
const { addGraphQLServer } = require('./graphql')

const services = {
  server: null,
}

const app = new Koa()

app.use(koaHelmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }))
app.use(koaCompress())
app.use(koaCors())
app.use(koaBody())

app.use(router)

addGraphQLServer(app)

app.start = async () => {
  log.info('Starting app...')

  // addGraphQLServer(app)

  // start my services here

  services.server = await new Promise((resolve, reject) => {
    const listen = app.listen(config.server.port, err => err ? reject(err) : resolve(listen))
  })
}

app.stop = async () => {
  log.info('Stopping app...')

  services.server.close()
}

app.start()
  .then(() => log.info('App is running.'))
  .catch((err) => log.error(err))

process.on('SIGINT', () => app.stop())
process.on('SIGTERM', () => app.stop())

module.exports = app