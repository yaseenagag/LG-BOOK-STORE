const express = require('express')
const router = express.Router()

// GET search page
router.get('/', (req, res, next) => {
  res.render('search')
});

module.exports = router
