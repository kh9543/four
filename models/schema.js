var mongoose = require('mongoose');

var user_s = mongoose.Schema({
    id: { type:String, default: null}, //Oauth
    name: String,
    email: String,
    provider: { type:String, default: null},
    photo_url: String,
    birthdate: { type:Date, default: null },
    phone: { type:String, default: null },
    profile: { type:String, default: null }
});

exports.User = mongoose.model('User', user_s);
