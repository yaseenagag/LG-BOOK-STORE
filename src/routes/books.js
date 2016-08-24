const express = require('express')
const router = express.Router()



//GET books page
// router.route('/', (req, res, next) => {
  router.get('/', (req, res, next) => {
    res.render('index')
    .catch(renderError(res))
  })

  router.get('/:id', (req, res, next) => {
    res.render('index').catch(renderError(res))
  })

  router.get('/create', (req, res, next) => {
    res.render('create').catch(renderError(res))
  })

  router.post('/', (req, res, next) => {
  })

  router.put('/:id', (req, res, next) => {
  })

  router.delete('/:id', (req, res, next) => {
  });
// });


module.exports = router
