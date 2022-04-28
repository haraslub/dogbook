'use strict'

const log = require('../utils/logger')
const { ApolloServer } = require('apollo-server-koa')
const { typeDefs, resolvers } = require('./schema')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')
const { getAuthPayload } = require('../middleware/authentication')
const errors = require('../utils/errors')
const UserDataLoader = require('./loaders/users')

const playgroundConfig = {
  settings: {
    'editor.theme': 'light',
    'editor.customShape': 'line',
    'editor.fontSize': 16,
  }
}

async function makeContext(app) {
  const data = await getAuthPayload(app.ctx.header.authorization)

  // create new context:
  return {
    user: data && data.user,
    loaders: {
      users: new UserDataLoader()
    },
    requireAuth: () => {
      if (!data) {
        throw new errors.UnauthorizedError()
      }
    }
  }
}

async function addGraphQLServer(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: playgroundConfig,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: makeContext,
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/graphql'
  })
}

module.exports = {
  addGraphQLServer,
}