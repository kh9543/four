var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '四人幫' , user: req.user});
});

router.get('/login', function(req, res, next){
    res.render('login', {title: 'Login'})

});

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
       failureRedirect: '/login'
  }),
  ensureAuthenticated,
  function(req, res) {
      //console.log(req.session);
      res.redirect('/');
});

router.get('/logout', ensureAuthenticated, function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports = router;
