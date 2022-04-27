'use strict'

const path = require('path')
const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge')
const { loadFilesSync } = require('@graphql-tools/load-files')

const typeDefsFiles = path.join(__dirname, './types/*.gql')
const typeDefs = mergeTypeDefs(loadFilesSync(typeDefsFiles), { all: true })

const resolversFiles = path.join(__dirname, './resolvers/*.js')
const resolvers = mergeResolvers(loadFilesSync(resolversFiles), { all: true})

module.exports = {
  typeDefs,
  resolvers,
}