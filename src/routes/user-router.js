/**
 * User routes based on example "Just Task It" by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { UserController } from '../controllers/user-controller.js'

export const router = express.Router()

const controller = new UserController()

// Connect HTTP verbs and route paths to controller actions.

router.get('/registration', controller.registration)
router.post('/register', controller.register)

router.get('/login', controller.login)
router.post('/userlogin', controller.authenticate)

router.get('/logout', controller.logout)
router.post('/userlogout', controller.logoutUser)
