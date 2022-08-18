/**
 * Mongoose model Snippet based on example "Just Task It" by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema for a snippet.
const snippetSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  user: {
    type: String,
    required: true,
    minlength: 1
  },
  author: {
    type: String,
    trim: true,
    minlength: 1
  }
}, {
  timestamps: true
})

// Create a model using the schema.
export const Snippet = mongoose.model('Snippet', snippetSchema)
