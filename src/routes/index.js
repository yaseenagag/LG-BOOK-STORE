const express = require('express')
const router = express.Router()

import db from '../database'

/* GET home page. */
router.get('/', (request, response, next) => {
  let page = parseInt(request.query.page, 10);
  if (isNaN(page)) page = 1;

  db.getAllBooks(page).then( books => {
    db.end()
    response.render('index', {
      page: page,
      books : books
     })
  }).catch( error => {
    db.end()
    response.send( error )
  })
})

module.exports = router
