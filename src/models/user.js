/**
 * Mongoose model User.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Create a schema for a user.
const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [150, 'The user name must be less than 150 characters.']
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be of minimum length 10 characters.'],
    maxlength: 1500
  }
})

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

/**
 * Authenticates user.
 *
 * @param {object} user - the username from the user.
 * @param {object} password - the password from the user.
 * @returns {object} currentUser.
 */
userSchema.statics.authenticate = async function (user, password) {
  const currentUser = await this.findOne({ user })
  if (!currentUser || !(await bcrypt.compare(password, currentUser.password))) {
    throw new Error('Invalid login attempt.')
  }
  return currentUser
}

// Create a model using the schema.
export const User = mongoose.model('User', userSchema)
