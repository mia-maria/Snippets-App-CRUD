/**
 * The routes based on example "Just Task It" by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { router as homeRouter } from './home-router.js'
import { router as userRouter } from './user-router.js'
import { router as snippetsRouter } from './snippets-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/user', userRouter)
router.use('/snippets', snippetsRouter)

router.use('*', (req, res, next) => {
  const error = new Error()
  error.status = 404
  error.message = 'Resource not found'
  next(error)
})
