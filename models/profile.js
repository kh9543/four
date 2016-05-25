var mongoose = require('mongoose');
var Profile = require('./schema').Profile;
var User = require('./user');

exports.addProfile = function (profile, callback) {
    profile.save(function(err){
        if(err) {
            callback(err);
        }
        else{
            callback(null, profile);
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
