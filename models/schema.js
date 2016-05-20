var mongoose = require('mongoose');
var user_s = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    provider: String,
    birthdate: { type:Date, default: null },
    phone: { type:String, default: null },
    profile: { type:String, default: null }
});
exports.userobject = mongoose.model('User', user_s);
