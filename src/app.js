import express from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import routes from './routes'

import mongoose from 'mongoose'

mongoose
  .connect('mongodb://localhost/carikan', {
    useNewUrlParser: true,
    keepAlive: true,
  })
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(err => {
    console.error.bind(console, err)
  })

const loggerMiddleware = (req, res, next) => {
  // -- Logged: ${req.url}  ${req.method}
  console.log(`\n${new Date()}`)
  next()
}

const app = express()

app.use(loggerMiddleware)

app.disable('x-powered-by')

// View engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.use(
  logger('dev', {
    skip: () => app.get('env') === 'test',
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

// Routes
app.use('/', routes)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).render('error', {
    message: err.message,
  })
})

export default app
