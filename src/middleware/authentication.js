'use strict'

const operations = require('../operations/users')
const { validate } = require('../validations')
const schemas = require('../validations/schemas/users')

async function authenticate(ctx, next) {
  // throwing a regular error if no context - this should never happen; if error is thrown we misused the code
  if (!ctx) {
    throw new Error('Context has to be defined!')
  }
	
  // get header value and check it otherwise
  // return null if parsedHeader does not meet conditions as it might be used in processes without authentication required
  const parsedHeader = await parseHeader(ctx.header.authorization)
  if (!parsedHeader || !parsedHeader.scheme || !parsedHeader.value
		|| parsedHeader.scheme.toLowerCase() !== 'jwt') {
    return null
  }

  // validate users jwtToken to be sure it 
  const input = { jwtToken: parsedHeader.value}
  // console.log(`\nAuthentication/authenticate: input.jwtToken=${input.jwtToken}`)
  console.log(`\nAuthentication/authenticate: input.jwtToken=${input}`)
  validate(schemas.jwtToken, input)

  // verify login timeout expiration and user + set it to the header
  const data = await operations.verifyTokenPayload(input)
  if (ctx.response && data.loginTimeout) {
    ctx.set('Login-timeout', data.loginTimeout) // common way how to set response header field to value
  }

  // set state which we got from out operation
  ctx.state.user = data.user
  return next() // to allow to the next middleware use ctx.state.user
}

function parseHeader(hdrValue) {
  if (!hdrValue || typeof hdrValue !== 'string') {
    return null
  }
  const matches = hdrValue.match(/(\S+)\s+(\S+)/u)
  return matches && {
    scheme: matches[1],
    value: matches[2],
  }
}

module.exports = {
  authenticate,
}