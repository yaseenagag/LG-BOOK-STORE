import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const routes = require('./routes/index')
<<<<<<< 6ffe8b52a96a53d58a895e0688c0f3a57649cb89
<<<<<<< 9d10ae1cac4834e1c27421746eef04503f92ebe1
=======
const users = require('./routes/users')
=======
>>>>>>> hopefully resolved merge conflict, deleted users route
const search = require('./routes/search')
const create = require('./routes/create')
const about = require('./routes/about')
>>>>>>> Created routes with views2

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)
<<<<<<< 6ffe8b52a96a53d58a895e0688c0f3a57649cb89
<<<<<<< 9d10ae1cac4834e1c27421746eef04503f92ebe1
=======
app.use('/users', users)
=======
>>>>>>> hopefully resolved merge conflict, deleted users route
app.use('/search', search)
app.use('/create', create)
app.use('/about', about)
>>>>>>> Created routes with views2

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use( (err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use( (err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
