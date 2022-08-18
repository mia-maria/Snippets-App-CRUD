/**
 * Module for the UserController based on example "Just Task It" by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import { User } from '../models/user.js'
import createError from 'http-errors'

/**
 * Represents a controller.
 */
export class UserController {
  /**
   * Returns a HTML form that lets a new user register.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registration (req, res, next) {
    try {
      res.render('user/registration')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Registers a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async register (req, res) {
    try {
      const user = new User({
        user: req.body.user,
        password: req.body.password
      })

      await user.save()

      req.session.flash = { type: 'success', text: 'The user was registered successfully.' }
      res.redirect('login')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('registration')
    }
  }

  /**
   * Returns a HTML form that lets a user log in to the application.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      res.render('./user/login')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Lets the user log in if the user name and password are valid.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async authenticate (req, res) {
    try {
      const user = await User.authenticate(req.body.user, req.body.password)

      req.session.regenerate(() => {
        req.session.loggedIn = true
        req.session.username = user.user
        req.session.userId = user._id
        req.session.flash = { type: 'success', text: 'You logged in successfully.' }
        res.redirect('../snippets')
      })
    } catch (error) {
      req.session.flash = {
        type: 'danger', text: error.message
      }
      res.redirect('login')
    }
  }

  /**
   * Returns a HTML form that lets a user log out.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      if (req.session.loggedIn) {
        res.render('./user/logout')
      } else {
        next(createError(404))
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Lets the user log out.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async logoutUser (req, res) {
    try {
      if (req.session.loggedIn) {
        req.session.loggedIn = false
        req.session.username = ''
        req.session.userId = ''
      }
      req.session.flash = { type: 'success', text: 'You logged out successfully.' }
      res.redirect('../')
    } catch (error) {
      req.session.flash = {
        type: 'danger', text: error.message
      }
      res.redirect('logout')
    }
  }
}
