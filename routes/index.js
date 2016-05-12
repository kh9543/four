var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '四人幫' , user: req.user});
});

router.get('/login', function(req, res, next){
    res.render('login', {title: 'Login'});
});

router.get('/auth/facebook',check_login, passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
       failureRedirect: '/auth/facebook/failuer'
  }),
  function(req, res){
      console.log(req);
      res.redirect('/');
  }
);

//
router.get('/auth/google',
  check_login,
  passport.authenticate('google', { scope:
    [ 'https://www.googleapis.com/auth/plus.login',
    , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));
router.get('/auth/google/callback',
    passport.authenticate( 'google', {
        failureRedirect: '/auth/google/failure'
    }),
    function(req, res){
        console.log(req);
        res.redirect ('/');
    }
);


router.get('/logout', ensureAuthenticated, function(req, res){
  req.logout();
  res.redirect('/');
});


function check_login(req, res, next){
    if(req.user==null) {return next();}
    res.redirect('/');
}


//check facebook authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports = router;
