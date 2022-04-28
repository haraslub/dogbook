'use strict'

const DataLoader = require('dataloader')
const R = require('ramda')
const usersOperations = require('../../operations/users')

class UserDataLoader extends DataLoader {
  constructor() {
    super(async userIds => {
      const users = await usersOperations.getByIds(userIds)
      
      // reorder users by their index 
      const userIndex = R.indexBy(user => user.id, users)
      return userIds.map(userId => userIndex[userId])
    })
  }
}

module.exports = UserDataLoader