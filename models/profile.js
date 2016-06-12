var mongoose = require('mongoose');
var Profile = require('./schema').Profile;
var User = require('./user');

exports.addProfile = function (profile,callback) {
    profile.save(function(err){
        if(err) {
            callback(err);
        }
        else{
            callback(null);
        }
    });
}

exports.findProfile = function (provider, o_id, callback) {
    User.findUser(provider, o_id, function(err, user){
        if(user){
            var query = Profile.where({ user: user._id });
            query.findOne(function(err, profile){
                if(err)
                    callback(err);
                if(profile)
                    callback(null, profile);
                else
                    callback(null, null);
            });
        }
        else{
            res.redirect('/');
            return;
        }
    });
}

exports.getProfileByUserID = function (id, callback) {
      var query = Profile.where({ user: id });
      query.findOne(function(err, profile){
          if(err)
              callback(err);
          if(profile)
              callback(null, profile);
          else
              callback(null, null);
      });
}


exports.editProfile = function (uid,updatedata,callback){
  console.log(updatedata);

  var conditions = { user:uid};
  console.log(conditions);
  Profile.findOne(conditions,function(err,profile){
    profile.intro= updatedata.intro;
    profile.s_exp= updatedata.s_exp;
    profile.w_exp= updatedata.w_exp;
    profile.achievement= updatedata.achievement;
    profile.save();
    if (err){callback(err);}else{callback(null);}
    }) ;
}
