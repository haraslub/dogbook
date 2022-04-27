'use strict'

const log = require('../utils/logger')
const { ApolloServer } = require('apollo-server-koa')
const { typeDefs, resolvers } = require('./schema')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')

const playgroundConfig = {
  settings: {
    'editor.theme': 'light',
    'editor.customShape': 'line',
    'editor.fontSize': 16,
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