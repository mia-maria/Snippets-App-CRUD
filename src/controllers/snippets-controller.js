/**
 * Snippets controller based on example "Just Task It" by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import { Snippet } from '../models/snippet.js'
import createError from 'http-errors'

/**
 * Encapsulates a controller.
 */
export class SnippetsController {
  /**
   * Presents a list of snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        snippets: (await Snippet.find({ user: { $ne: req.session.userId } }))
          .map(snippet => ({
            id: snippet._id,
            description: snippet.description,
            user: snippet.user,
            author: snippet.author
          }))
      }
      const userData = {
        snippets: (await Snippet.find({ user: req.session.userId }))
          .map(snippet => ({
            id: snippet._id,
            description: snippet.description,
            user: snippet.user,
            author: snippet.author
          }))
      }
      res.render('snippets/index', { viewData, userData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form where a registered user can create a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async new (req, res, next) {
    if (req.session.loggedIn) {
      const viewData = {
        description: '',
        done: false
      }
      res.render('snippets/new', { viewData })
    } else {
      next(createError(404))
    }
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    try {
      if (req.session.loggedIn) {
        const snippet = new Snippet({
          description: req.body.description,
          user: req.session.userId,
          author: req.session.username
        })

        await snippet.save()

        req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
        res.redirect('.')
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./new')
    }
  }

  /**
   * Returns a HTML form where an author of a snippet can edit it.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async edit (req, res, next) {
    try {
      if (req.session.loggedIn) {
        const snippet = await Snippet.findOne({ _id: req.params.id })
        if (snippet.user === req.session.userId) {
          const viewData = {
            id: snippet._id,
            description: snippet.description
          }
          res.render('snippets/edit', { viewData })
        } else {
          next(createError(403))
        }
      } else if (!req.session.loggedIn) {
        next(createError(404))
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Updates a specific snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async update (req, res) {
    try {
      if (req.session.loggedIn) {
        const snippet = await Snippet.findOne({ _id: req.params.id })
        if (snippet.user === req.session.userId) {
          const result = await Snippet.updateOne({ _id: req.body.id }, {
            description: req.body.description
          })

          if (result.nModified === 1) {
            req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
          } else {
            req.session.flash = {
              type: 'danger',
              text: 'The snippet was not updated.'
            }
          }
          res.redirect('..')
        }
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./edit')
    }
  }

  /**
   * Returns a HTML form that lets an author of a snippet remove it.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async remove (req, res, next) {
    try {
      if (req.session.loggedIn) {
        const snippet = await Snippet.findOne({ _id: req.params.id })
        if (snippet.user === req.session.userId) {
          const viewData = {
            id: snippet._id,
            description: snippet.description
          }
          res.render('snippets/remove', { viewData })
        } else {
          next(createError(403))
        }
      } else if (!req.session.loggedIn) {
        next(createError(404))
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes the particularized snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete (req, res) {
    try {
      if (req.session.loggedIn) {
        const snippet = await Snippet.findOne({ _id: req.params.id })
        if (snippet.user === req.session.userId) {
          await Snippet.deleteOne({ _id: req.body.id })

          req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
          res.redirect('..')
        }
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./remove')
    }
  }
}
