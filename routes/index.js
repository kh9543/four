var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing/index');
});
router.get('/reg', function(req, res, next) {
  res.render('landing/register');
});

module.exports = router;
