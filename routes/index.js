var express = require('express');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var multer = require('multer');
var upload_img = multer({
    dest: 'uploads/images',
});
var mongoose = require('mongoose');
// models
var schema = require('../models/schema');
var User = require('../models/user');
var Profile = require('../models/profile');
var PM_Case = require('../models/pm_case');
var db = require('../models/db');

//

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing/index', {
      //email: req.session.email,
      error: req.flash('error'),
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
            email : req.user.email,
            birthdate : req.user.birthdate
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
                    req.session.birthdate = user.birthdate;
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
                  req.session.birthdate= user.birthdate;
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
              birthdate: req.session.birthdate,
              intro: profile.intro,
              s_exp: profile.s_exp,
              w_exp: profile.w_exp,
              achievement: profile.achievement

          });
          return;
      }
      else{
         var profile_s = schema.Profile;
         User.findUser(req.session.provider, req.session.o_id, function(err, user){
         if(user){
           var newProfile = new profile_s ({
             intro: null,
             s_exp: null,
             w_exp: null,
             achievement: null,
             user: user._id
           });
           Profile.addProfile(newProfile, function(err){
               if(err){
                   req.flash('error', '失敗');
               }
               res.redirect('/profile');
           });
        }
   });
   }
});
});


router.get('/mycase', ensureAuthenticated, function(req, res, next) {
  res.render('landing/mycase', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url

  });
});

//#
router.get('/cases/:target/list', ensureAuthenticated, function(req, res, next) {
    // if(req.params.target="self")
    // else if(req.params.target="any")
    // else
    // return res.json({ cases });
    console.log('fixing');
});

router.get('/mywork', ensureAuthenticated,function(req, res, next) {
  res.render('landing/mywork', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url
  });
});


router.get('/create_case', ensureAuthenticated, function(req, res, next) {
  res.render('landing/create_case', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url
  });
});


router.post('/create_case', ensureAuthenticated, upload_img.single('file'), function(req, res, next){
    var pm_case = schema.PM_Case;
    var newPM_Case = new pm_case ({
        name: req.body.name,
        money: req.body.money,
        description: req.body.detail,
        location: req.body.location,
        recruit_dealine: req.body.endDate,
        case_start: req.body.fromDate,
        case_end: req.body.toDate,
        status: "finding",
        image_name: req.file.filename
    });

    PM_Case.addCase(newPM_Case, function(err){
        if(err)
            console.log('失敗');
        else {
            console.log("成功");
            // res.redirect('/mycase');
        }
    });
    // console.log(req.body);
    // console.log(req.file);
});

router.post('/profile/edit/user', ensureAuthenticated, function(req,res){
  console.log(req.body);
    req.session.birthdate=req.body.birthdate;
    req.session.email=req.body.email;
    var currentuser= req.session.o_id;
    var updatedata ={
      birthdate: req.body.birthdate,
      email: req.body.email
    };
    User.editUser(currentuser,updatedata,function(err){
      if (err) {
        req.flash('error', err);
      }
      req.flash('success', '修改成功!');
      res.redirect('/profile');
    });
});


router.post('/profile/edit/profile', ensureAuthenticated, function(req,res){
  var updatedata = {
    intro: req.body.intro,
    s_exp: req.body.s_exp,
    w_exp: req.body.w_exp,
    achievement: req.body.achievement
  };
  User.findUser(req.session.provider, req.session.o_id, function(err, user){
    if (user)
    {
      var uid=user._id;
      Profile.editProfile(uid,updatedata,function(err){
        if (err) {
          req.flash('error', err);
        }
        req.flash('success', '修改成功!');
        res.end();
      });
    }
  });
});

router.get('/images/:file', function(req,res,next){
    var file = req.params.file;
    res.sendFile('/uploads/images/'+file, { root : path.join(__dirname, '..')});
});

//check authentication
function ensureAuthenticated(req, res, next) {
  if (req.session.o_id) { return next(); }
  req.flash('error','未登入')
  res.redirect('/');
  return;
}

function checkNotLogin(req, res, next) {
    if (!req.session.o_id) { return next(); }
    res.redirect('/');
    return;
}

module.exports = router;
