const { AuthError } = require('apollo-server-express')
const { User } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({__id: context.user._id}).select('-__v -password')
      }
      throw new AuthError('You need to log in.')
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const newUser = await User.create(args)
      const token = signToken(newUser)

      return { token, newUser}
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email })

      if (!user) {
        throw new AuthError('User not found')
      }

      const correctPw = await user.isCorrectPassword(password)

      if (!correctPw) {
        throw new AuthError('Credentials do not match!')
      }

      const token = signToken(user)

      return { token, user }
    },

    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book }},
          { new: true }
        )

        return user
      };
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId }}},
          { new: true }
        )

        return user
      };
    }
  }
}

module.exports = resolvers;