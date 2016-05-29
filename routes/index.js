var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var mongoose = require('mongoose');
// models
var schema = require('../models/schema');
var User = require('../models/user');
var Profile = require('../models/profile');
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
        var photo_resize = req.user.photos[0].value.replace("?sz=50", "?sz=200");
        var newUser = new user_s ({
            id : req.user.id,
            provider : req.user.provider,
            name : req.user.displayName,
            photo_url : photo_resize,
            email : req.user.email
        });
        //console.log(newUser.photo_url);
        delete req.session.passport;
        User.findUser(newUser.provider, newUser.id, function(err, user){
            if(user){
                req.session.o_id = user.id;
                req.session.name = user.name;
                req.session.provider = user.provider;
                req.session.photo_url = user.photo_url;
                req.session.birthdate = user.birthdate;
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
                    res.redirect('/profile');
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
      if(req.user.emails===undefined || req.user.emails===null)
          email_checked = null;
      else
          email_checked = req.user.emails[0].value;
      var newUser = new user_s ({
          id : req.user.id,
          provider : req.user.provider,
          name : req.user.displayName,
          photo_url : req.user.photos[0].value,
          email : email_checked //care
      });
      delete req.session.passport;
      User.findUser(newUser.provider, newUser.id, function(err, user){
          if(user){
              req.session.o_id = user.id;
              req.session.name = user.name;
              req.session.provider = user.provider;
              req.session.photo_url = user.photo_url;
              req.session.birthdate = user.birthdate;
              req.session.profile = user.profile;
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
                  res.redirect('/profile');
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

router.get('/profile',ensureAuthenticated, function(req, res, next) {
  Profile.findProfile(req.session.provider ,req.session.o_id, function(err, profile){
      if(err){
          console.log(err);
          res.redirect('/');
          return;
      }
      else if(profile){
          res.render('landing/profile', {
              o_id: req.session.o_id,
              name: req.session.name,
              photo_url: req.session.photo_url,
              email: req.session.email,
              intro: profile.intro,
              s_exp: profile.s_exp,
              w_exp: profile.w_exp,
              achievement: profile.achievement
          });
          return;
      }
      else{
          res.render('landing/profile', {
              //email: req.session.email,
              o_id: req.session.o_id,
              name: req.session.name,
              photo_url: req.session.photo_url,
              email: req.session.email,
              intro: null,
              s_exp: null,
              w_exp: null,
              achievement: null
          });
      }

  });

router.post('/profile/upload', upload.single('img'), function(req, res){
    console.log(req.file);
    res.redirect("/profile");
});

router.post('/profile/edit/:action', ensureAuthenticated, function(req,res){
    console.log(req.params.action);
});

});
router.get('/mycase', ensureAuthenticated,function(req, res, next) {
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

router.get('/create_case', function(req, res, next) {
  res.render('landing/create_case', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url
  });
});
router.post('/create_case', function(req, res, next){

    console.log(req.body.title);
    console.log(req.body.money);
    console.log(req.body.location);
});

router.get('/test', function(req, res, next) {
  res.render('landing/test', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url
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
