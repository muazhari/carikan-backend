import { Router } from 'express'

import {
  createUser,
  readUser,
  updateUser,
  deleteUser,
} from './Controllers/User'

import {
  createPost,
  readPost,
  updatePost,
  deletePost,
} from './Controllers/Post'

import {
  createComment,
  readComment,
  updateComment,
  deleteComment,
} from './Controllers/Comment'

const routes = Router()

// User CRUD

routes.get('/user', readUser)
routes.post('/user', createUser)
routes.put('/user:uid', updateUser)
routes.delete('/user/:uid', deleteUser)

// Post CRUD
routes.get('/post', readPost)
routes.post('/post', createPost)
routes.put('/post/:postId', updatePost)
routes.delete('/post/:postId', deletePost)

// Comment CRUD
routes.get('/post/:postId/comment', readComment)
routes.post('/post/:postId/comment', createComment)
routes.put('/post/:postId/comment/:commentId', updateComment)
routes.delete('/post/:postId/comment/:commentId', deleteComment)

// Home page
routes.get('/', (req, res) => {
  res.render('index', { title: 'Carikan Server Splash!' })
})

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'))
    return
  }

  res.render('index', { title })
})

export default routes
