var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing/index');
});

/* Get profile page */
router.get('/profile', function(req, res, next) {
  res.render('landing/profile');
});

module.exports = router;
