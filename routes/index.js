var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var mongoose = require('mongoose');
// models
var schema = require('../models/schema');
var User = require('../models/user')
var db = require('../models/db');
//

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing/index', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url
  });
});

router.get('/auth/google',
    checkNotLogin,
  passport.authenticate('google', { scope:
    [ 'https://www.googleapis.com/auth/plus.login',
    , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));
router.get('/auth/google/callback',
    passport.authenticate( 'google', {
        failureRedirect: '/auth/google/failure'
    }),
    function(req, res){
        var user_s = schema.User;
        var newUser = new user_s ({
            id : req.user.id,
            provider : req.user.provider,
            name : req.user.displayName,
            photo_url : req.user.photos[0].value,
            email : req.user.email
        });
        delete req.session.passport;
        User.findUser(newUser.provider, newUser.id, function(err, user){
            if(user){
                req.session.o_id = user.id;
                req.session.name = user.name;
                req.session.provider = user.provider;
                req.session.photo_url = user.photo_url;
                req.session.email = user.email;
                res.redirect('/');
                return;
            }
            User.addUser(newUser, function(err, user){
                if(err){
                    req.flash('error', '註冊失敗');
                    res.redirect('/');
                }
                else{
                    req.flash('success', '註冊成功');
                    req.session.o_id = user.id;
                    req.session.name = user.name;
                    req.session.provider = user.provider;
                    req.session.photo_url = user.photo_url;
                    req.session.email = user.email;
                    res.redirect('/manage');
                }
            });

        });
    }
);


router.get('/auth/facebook', checkNotLogin, passport.authenticate('facebook', {scope : ['public_profile','email']}));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
       failureRedirect: '/auth/facebook/failuer'
  }),
  function(req, res){
      var user_s = schema.User;
      var newUser = new user_s ({
          id : req.user.id,
          provider : req.user.provider,
          name : req.user.displayName,
          photo_url : req.user.photos[0].value,
          email : req.user.emails[0].value  //care
      });
      delete req.session.passport;
      User.findUser(newUser.provider, newUser.id, function(err, user){
          if(user){
              req.session.o_id = user.id;
              req.session.name = user.name;
              req.session.provider = user.provider;
              req.session.photo_url = user.photo_url;
              req.session.email = user.email;
              res.redirect('/');
              return;
          }
          User.addUser(newUser, function(err, user){
              if(err){
                  req.flash('error', '註冊失敗');
                  res.redirect('/');
              }
              else{
                  req.flash('success', '註冊成功');
                  req.session.o_id = user.id;
                  req.session.name = user.name;
                  req.session.provider = user.provider;
                  req.session.photo_url = user.photo_url;
                  req.session.email = user.email;
                  res.redirect('/manage');
              }
          });

      });
  }
);

router.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

router.get('/mycase', ensureAuthenticated, function(req, res, next) {
  res.render('landing/mycase', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url
  });
});
router.get('/mywork', ensureAuthenticated,function(req, res, next) {
  res.render('landing/mywork', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url
  });
});

router.get('/manage', ensureAuthenticated, function(req,res){
    res.render('landing/manage', {
        id : req.session.o_id,
        name : req.session.name,
        photo_url : req.session.photo_url,
        success: req.flash('success'),
        error: req.flash('error')
    });
});

//check authentication
function ensureAuthenticated(req, res, next) {
  if (req.session.o_id) { return next(); }
  res.redirect('/');
  return;
}

function checkNotLogin(req, res, next) {
    if (!req.session.o_id) { return next(); }
    res.redirect('/');
    return;
}


module.exports = router;
