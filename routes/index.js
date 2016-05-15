var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing/index');
});
router.get('/mycase', function(req, res, next) {
  res.render('landing/mycase');
});
router.get('/mywork', function(req, res, next) {
  res.render('landing/mywork');
});

module.exports = router;
