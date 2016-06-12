var mongoose = require('mongoose');
var Profile_pdf = require('./schema').Profile_pdf;
var User = require('./user');

exports.addProfilePDF = function (profile_pdf,callback) {
    profile_pdf.save(function(err){
        if(err) {
            callback(err);
        }
        else{
            callback(null);
        }
    });
}


exports.getProfilePDf = function(id, callback) {
    var query = Profile_pdf.where({ user: id });
    query.find(function(err, pdfs){
        if(err)
            callback(err);
        if(pdfs)
            callback(null, pdfs);
        else
            callback(null, null);
    });
}
