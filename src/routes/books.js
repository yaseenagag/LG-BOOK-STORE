const express = require('express')
const router = express.Router()

import db from '../database'


//GET books page
router.get('/', (request, response, next) => {
  response.render('index')
})

router.get('/create', (request, response, next) => {
  response.render('create')
})

router.get('/:id', (request, response, next) => {
  db.getBookById(request.params.id).then(book => {
    db.end()
    response.render('details', {
      book: book
    })
  })
})

router.post('/', (request, response, next) => {
  response.send('Sending to POSTMAN')
})

router.put('/:id', (request, response, next) => {
})

router.delete('/:id', (request, response, next) => {
});



module.exports = router
