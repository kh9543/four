var mongoose = require('mongoose');
var PM_Case = require('./schema').PM_Case;

exports.addCase = function (pm_case, callback) {
    pm_case.save(function(err){
        if(err) {
            callback(err);
        }
        else{
            callback(null);
        }
    });
}


exports.getCase = function() {

}

exports.getCases = function () {

}
