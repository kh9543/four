var mongoose = require('mongoose');
var User = require('./schema').User;

exports.addUser = function (user, callback) {
    user.save(function(err){
        if(err) {
            callback(err);
        }
        else{
            callback(null, user);
        }
    });
}

exports.findUser = function (provider, o_id, callback) {
    var query = User.where({ id: o_id });
    if(provider=="google" || provider=="facebook") {
        query.findOne(function(err, user){
            if(err)
                callback(err);
            if(user)
                callback(null, user);
            else
                callback(null, null);
        });
    }
    else if (provider=="four"){

    }
    else{
        console.log("user error");
    }
}

exports.editUser = function (o_id,updatedata,callback){
  console.log(updatedata.email);

  var conditions = { id:o_id};
    console.log(conditions);
  User.findOne(conditions,function(err,user){
  user.email= updatedata.email;
  user.birthdate=updatedata.birthdate;
  user.save();
  if (err){callback(err);}else{callback(null);}

  }) ;

}
