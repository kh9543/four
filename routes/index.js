var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('landing/index', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url
  });
});

router.get('/auth/google',
  passport.authenticate('google', { scope:
    [ 'https://www.googleapis.com/auth/plus.login',
    , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));
router.get('/auth/google/callback',
    passport.authenticate( 'google', {
        failureRedirect: '/auth/google/failure'
    }),
    function(req, res){
        req.session.authenticated = true;
        req.session.provider = req.user.provider;
        req.session.name = req.user.displayName;
        req.session.photo_url = req.user.photos[0].value;
        req.session.email = req.user.email;
        delete req.session.passport;
        console.log(req.session);
        res.redirect ('/');
    }
);
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
       failureRedirect: '/auth/facebook/failuer'
  }),
  function(req, res){
      req.session.authenticated = true;
      req.session.provider = req.user.provider;
      req.session.name = req.user.displayName;
      req.session.photo_url = req.user.photos[0].value;
      req.session.email = req.user.emails[0].value;
      delete req.session.passport;
      console.log(req.session);
      res.redirect('/');
  }
);

router.get('/logout', ensureAuthenticated, function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('/');
});


//check facebook authentication
function ensureAuthenticated(req, res, next) {
  if (req.session.authenticated) { return next(); }
  res.redirect('/')
}

router.get('/login', function(req, res, next){
    res.render('login', {title: 'Login'});
});


module.exports = router;
