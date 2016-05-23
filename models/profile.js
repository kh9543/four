var mongoose = require('mongoose');
var Profile = require('./schema').Profile;

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

exports.findProfile = function (o_id, callback) {
    var query = Profile.where({ user: o_id });
    query.findOne(function(err, profile){
        if(err)
            callback(err);
        if(profile)
            callback(null, profile);
        else
            callback(null, null);
    });

}
