const express = require('express')
const router = express.Router()

import db from '../database'

//GET books page
router.get('/', (request, response, next) => {
  response.redirect('/')
})

router.get('/create', (request, response, next) => {
  db.getAllGenres()
    .then( genres => response.render( 'create', { genres } ))
    .catch( error => response.send({ error, message: error.message }))
})

router.get('/:id', (request, response, next) => {
  db.getBookAndAuthorsAndGenresByBookId( request.params.id )
    .then( book => {
      db.end()
      response.render('details', {
        book: book
      })
    })
})

router.post('/', (request, response, next) => {
  db.createBook( request.body )
    .then( bookId => response.redirect( `/books/${bookId}` ) )
    .catch( error => response.send({ error, message: error.message }) )
})

router.put('/:id', (request, response, next) => {
})

router.delete('/:id', (request, response, next) => {
  console.log('here')
  db.deleteBook(request.query.id)
  console.log("query", request.query)
  console.log("params",request.params)
  console.log("body",request.body)
  console.log("query.id",request.query.id)
  console.log("params.id",request.params.id)
  console.log("body.id",request.body.id)
    .then( result => response.redirect( `/` ) )
    .catch( error => response.send({ error, message: error.message }) )
});



module.exports = router
