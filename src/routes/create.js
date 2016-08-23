const express = require('express')
const router = express.Router()

//GET create page
router.get('/', (req, res, next) => {
  res.render('create')
});

module.exports = router
