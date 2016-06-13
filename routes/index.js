var express = require('express');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var multer = require('multer');
var upload_img = multer({
    dest: 'uploads/images',
    limits:{
        fileSize: 15 * 1000 *1
    },
    fileFilter: function (req, file, cb) {
        console.log(file.mimetype);
        if (file.mimetype != "image/png" || file.mimetype != "image/jpg" || file.mimetype != "image/jpeg" || file.mimetype != "image/gif") {
          return cb(new Error('Only jpg, jpeg, gif, png are allowed'))
        }
        cb(null, true)
    }
});
var upload_pdf = multer({
    dest: 'uploads/pdfs',
    limits: {
        fileSize: 15 * 1000 * 1000
    },
    fileFilter: function (req, file, cb) {
        console.log(file.mimetype);
        if (file.mimetype != "application/pdf") {
          return cb(new Error('Only pdfs are allowed'))
        }
        cb(null, true)
    }
});
var mongoose = require('mongoose');
// models
var schema = require('../models/schema');
var User = require('../models/user');
var Profile = require('../models/profile');
var Profile_pdf = require('../models/profile_pdf');
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
                req.session.a_id = user._id;
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
                    req.session.a_id = user._id;
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
              req.session.a_id = user._id;
              req.session.o_id = user.id;
              req.session.name = user.name;
              req.session.provider = user.provider;
              req.session.photo_url = user.photo_url;
              req.session.birthdate = user.birthdate;
              req.session.profile = user.profile;
              req.session.email = user.email;
              console.log(user._id);
              console.log(req.session.a_id);
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
                  req.session.a_id = user._id;
                  req.session.o_id = user.id;
                  req.session.name = user.name;
                  req.session.provider = user.provider;
                  req.session.photo_url = user.photo_url;
                  req.session.email = user.email;
                  req.session.birthdate= user.birthdate;
                  console.log(req.session.a_id);
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
          Profile_pdf.getProfilePDf(profile._id, function(err, pdfs){
              if(err){
                  console.log(err);
              }
              else if(pdfs)
              {
                  var result = new Array();
                  for(var i = 0; i < pdfs.length; i++)
                  {
                      var url = '/pdfs/'+pdfs[i].pdf_name;
                      var date = new Date(pdfs[i].upload_time);
                      var d = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();

                      var word = null;
                      switch (pdfs[i].p_type) {
                          case 'photograph':
                              word = "拍攝";
                              break;
                          case 'postProduction':
                              word = "後製";
                              break;
                          case 'word':
                              word = "文案";
                              break;
                          case 'others':
                              word = "其他";
                              break;
                      }
                      var temp = {
                          name: pdfs[i].name,
                          type: word,
                          uploaddate: d,
                          ispublic: pdfs[i].ispublic,
                          pdf_url: url
                      };
                      result.push(temp);
                  }
                  res.render('landing/profile', {
                      o_id: req.session.o_id,
                      name: req.session.name,
                      photo_url: req.session.photo_url,
                      email: req.session.email,
                      birthdate: req.session.birthdate,
                      intro: profile.intro,
                      s_exp: profile.s_exp,
                      w_exp: profile.w_exp,
                      achievement: profile.achievement,
                      pdfs:  result
                  });
                  return;
              }

          });

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

router.post('/profile/edit/pdfs', ensureAuthenticated, upload_pdf.single('file'), function(req,res){
      if(!req.file){
          res.status(500).send("failed");
          console.log(err)
          return;
      }
      Profile.findProfile(req.session.provider ,req.session.o_id, function(err, profile){
          if(err){
                res.status(500).send("failed");
                console.log(err)
                return;
          }
          else if(profile)
          {
              var word = null;
              switch (req.body.type) {
                  case '拍攝':
                      word = "photograph";
                      break;
                  case '後製':
                      word = "postProduction";
                      break;
                  case '文案':
                      word = "word";
                      break;
                  case '其他':
                      word = "others";
                      break;
              }
              var profile_pdf = schema.Profile_pdf;
              var newProfile_pdf = new profile_pdf ({
                  name: req.body.name,
                  ispublic: req.body.ispublic,
                  p_type: word,
                  pdf_name: req.file.filename,
                  user: profile._id
              });
              Profile_pdf.addProfilePDF(newProfile_pdf, function(err){
                  if(err){
                      res.status(500).send("failed");
                      console.log(err);
                      return;
                  }
                  else{
                      res.send("success");
                      console.log("新增案件成功");
                      return;
                  }
              });
          }
          else {
                res.status(500).send("Profile not found");
          }

      });
      console.log(req.body);
      console.log(req.file);
});

router.get('/pm_case/:id',ensureAuthenticated, function(req, res, next) {
    PM_Case.getACase(req.params.id, function(err, pm_case){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else if(pm_case){
            User.getUser(pm_case.proposer, function(err, proposer){
                if(err){
                    res.redirect('/');
                    return;
                }
                else if(proposer){
                    Profile.getProfileByUserID(proposer._id, function(err, profile){
                        var intro = null;
                        if(profile)
                            intro = profile.intro;
                        res.render('landing/case_description', {
                            //email: req.session.email,
                            name: req.session.name,
                            photo_url: req.session.photo_url,
                            proposer_name: proposer.name,
                            proposer_intro: intro,
                            proposer_photo: proposer.photo_url,
                            case_name: pm_case.name,
                            case_money: pm_case.money,
                            case_photo: imageRoute(pm_case.image_name),
                            recruit_dealine: dateParser(pm_case.recruit_dealine),
                            case_start: dateParser(pm_case.case_start),
                            case_end: dateParser(pm_case.case_end),
                            case_location: pm_case.location,
                            case_description: pm_case.description,
                            case_applyNum: pm_case.applicants.length,
                            error: req.flash('error')
                        });
                    })
                }
                else {
                    req.flash('error', 'No proposer for the case... please contact web manger')
                    res.redirect('/');
                    return;
                }
            });

        }
        else {
            res.redirect('/');
        }
    });

});

//#
router.get('/mywork', ensureAuthenticated,function(req, res, next) {
  res.render('landing/mywork', {
      //email: req.session.email,
      name: req.session.name,
      photo_url: req.session.photo_url
  });
});

router.get('/search_case', function(req, res, next) {
    PM_Case.listAllCase(function(err, allcases){
        if (err) {
            req.flash("error", "找不到案件")
            return res.redirect('/');
        }
        else if (allcases)
        {
            var result = new Array();
            for(var i = 0; i < allcases.length; i++)
            {
                var applicants = allcases[i].applicants.length;
                var url = '/images/'+allcases[i].image_name;
                var date = allcases[i].recruit_dealine;
                var d = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();

                var temp = {
                    id: allcases[i]._id,
                    name: allcases[i].name,
                    applicant: applicants,
                    date: d,
                    location: allcases[i].location,
                    money: allcases[i].money,
                    pic_url: url,
                    status: allcases[i].status,
                };
                result.push(temp);
                //console.log(allcases[i]);
                //console.log(temp);
            }
            res.render('landing/search_case', {
                error: req.flash('error'),
                name: req.session.name,
                photo_url: req.session.photo_url,
                cases: result
            });
            return;
        }
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
        image_name: req.file.filename,
        proposer: req.session.a_id
    });
    PM_Case.addCase(newPM_Case, function(err){
        if(err){
            res.status(500).send("failed");
            console.log(err);
        }
        else {
            res.send("success");
            console.log("新增案件成功");
        }
    });
    // console.log(req.body);
    // console.log(req.file);
});


router.get('/mycase', ensureAuthenticated, function(req, res, next) {
    PM_Case.listMyCase(req.session.a_id, function(err, mycases){
        if (err) {
            req.flash("error", "找不到案件")
            return res.redirect('/');
        }
        else if (mycases)
        {
            var result = new Array();
            for(var i = 0; i < mycases.length; i++)
            {
                var applicants = mycases[i].applicants.length;
                var url = '/images/'+mycases[i].image_name;
                var date = mycases[i].recruit_dealine;
                var d = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
                var word = null;

                switch (mycases[i].status) {
                    case 'finding':
                        word = "找人中";
                        break;
                    case 'found':
                        word = "找人成功";
                        break;
                    case 'finished':
                        word = "已完工";
                        break;
                }
                var temp = {
                    id: mycases[i]._id,
                    name: mycases[i].name,
                    applicant: applicants,
                    date: d,
                    location: mycases[i].location,
                    money: mycases[i].money,
                    pic_url: url,
                    status: mycases[i].status,
                    status_word: word
                };
                result.push(temp);
            }
            res.render('landing/mycase', {
                name: req.session.name,
                photo_url: req.session.photo_url,
                cases: result
            });
            return;
        }
    });
});

router.post('/mycase/remove/:id', ensureAuthenticated, function(req, res) {
    //need to sanitize params
    var case_id = req.params.id;
    console.log(req.session.a_id);
    PM_Case.removeCase(case_id ,req.session.a_id, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("success");
        }
    })
}) ;

router.get('/images/:file', function(req,res,next){
    var file = req.params.file;
    res.sendFile('/uploads/images/'+file, { root : path.join(__dirname, '..')});
});

router.get('/pdfs/:file', function(req, res, next){
    var file = req.params.file;
    res.sendFile('/uploads/pdfs/'+file, { root : path.join(__dirname, '..')});
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

function imageRoute(name)  {
    return '/images/'+name;
}

function dateParser(d) {
    return d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate();
}

module.exports = router;
