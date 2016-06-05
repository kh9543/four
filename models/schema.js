var mongoose = require('mongoose');

var user_s = mongoose.Schema({
    id: { type:String, default: null}, //Oauth
    name: String,
    email: String,
    provider: { type:String, default: null},
    photo_url: String,
    birthdate: { type:Date, default: null },
    phone: { type:String, default: null },
});

var profile_s = mongoose.Schema({
    intro: {type:String, default: null},
    s_exp: {type:String, default: null},
    w_exp: {type:String, default: null},
    achievement: {type:String, default: null},
    user: [
      {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ]
});

var profile_pdf_s =  mongoose.Schema({
    upload_time : { type: Date, default: Date.now },
    ispublic: { type: Boolean, default: false },
    file_path: String,
    p_type: String,
    user: [
      {type: mongoose.Schema.Types.ObjectId, ref: 'Profile'}
    ]
});

var pm_case_s = mongoose.Schema({
    name: String,
    description: String,
    money: Number,
    location: String,
    recruit_dealine: Date,
    case_start: Date,
    case_end: Date,
    status: {type: String, enum: ['finding', 'found', 'finished']},
    image_name: String,
    applicants: [
      {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    proposer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    pm: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});
/*
var ocupation_s = mongoose.Schema({

});
*/

exports.User = mongoose.model('User', user_s);
exports.Profile = mongoose.model('Profile', profile_s);
exports.PM_Case = mongoose.model('PM_Case', pm_case_s);
