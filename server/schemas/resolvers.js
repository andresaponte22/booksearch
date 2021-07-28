const { AuthError } = require('apollo-server-express')
const { User } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({__id: context.user._id})
      }
      throw new AuthError('You need to log in.')
    },
  }
}

module.exports = resolvers;