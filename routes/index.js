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
/* Get mycase page */
router.get('/mycase', function(req, res, next) {
  res.render('landing/mycase');
});
 /* Get mywork page*/
 router.get('/mywork', function(req, res, next) {
   res.render('landing/mywork');
 });
module.exports = router;
