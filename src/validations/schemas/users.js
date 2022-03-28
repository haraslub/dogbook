'use strict'

const signUp = {
  type: 'Object',
  required: true,
  properties: {
    name: {
      type: 'String',
      required: true,
      pattern: '^[A-Za-z. -]+$', 
      maxLength: 80,
    },
    email: {
      type: 'String',
      required: true,
      format: 'email', 
      maxLength: 80,
    },
    password: {
      type: 'String',
      required: true,
      minLength: 8, 
      maxLength: 80,
    },
  }
}

const logIn = {
  type: 'Object',
  required: true,
  properties: {
    email: {
      type: 'String',
      required: true,
      format: 'email', 
      maxLength: 80,
    },
    password: {
      type: 'String',
      required: true,
      minLength: 8, 
      maxLength: 80,
    },
  }
}

const jwtToken = {
  type: 'Object',
  required: true,
  properties: {
    jwtToken: {
      type: 'string',
      required: 'true',
    }
  }
}

module.exports = {
  signUp,
  logIn,
  jwtToken,
}