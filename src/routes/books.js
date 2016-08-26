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

router.get('/update/:id', (request, response, next) => {
  return Promise.all([
    db.getBookAndAuthorsAndGenresByBookId( request.params.id ),
    db.getAllGenres()
  ])
  .then( results => {
    response.render( 'update', { book: results[ 0 ], genres: results[ 1 ] } )
  })
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

router.post('/:id', (request, response, next) => {
  const book = Object.assign({id: request.params.id}, request.body)

  db.updateBook( book )
    .then( id => response.redirect( `/books/${id}`) )
    .catch( error => response.send({ error, message: error.message }))
})

router.delete('/:id', (request, response, next) => {
  db.deleteBook( request.params.id )
    .then( result => response.send({}) )
    .catch( error => response.send({ error, message: error.message }) )
});



module.exports = router
