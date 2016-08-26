const express = require('express')
const router = express.Router()

import db from '../database'

// GET search page
router.get( '/', (request, respond, next) => {
  const searchOptions = request.query
  if (!('genres' in searchOptions)) 
    searchOptions.genres = []
  if (!Array.isArray(searchOptions.genres))
    searchOptions.genres = [searchOptions.genres]

  if (!('fiction' in searchOptions)) searchOptions.fiction = ''

  Promise.all([
    db.getAllGenres(),
    db.searchForBooks(searchOptions)
  ])
    .then((data) => {
      const genres = data[0];
      const books = data[1];
      respond.render('search', {
        genres: genres,
        books: books,
        searchOptions: searchOptions
      })
    })
});

module.exports = router
