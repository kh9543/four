var mongoose = require('mongoose');
var db = require('./db');
var schema = require('./schema')

function User(user){
    if(oauth(user)){
        //facebook or google+ login
        this.id = user.id;
    }
    else {
        console.log('custom user');
        this.id = "0";
    }
    this.name = user.name;
    this.email = user.email;
    this.provider = user.provider;
};

module.exports = User;

User.prototype.save = function (callback) {
    var newUser = new schema.userobject;
    newUser.id = this.id;
    newUser.name = this.name;
    newUser.email = this.email;
    newUser.provider = this.provider;
    newUser.save;
};

User.get = function (provider, email, callback) {
    console.log('User query');
};

function oauth(user) {
    if(user.provider == "four")
        return false;
    return true;
};
