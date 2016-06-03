var mongoose = require('mongoose');
var PM_Case = require('./schema').PM_Case;
var User = require('./user');

//proposer function
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

exports.removeCase = function (c_id, u_id ,callback) {
    var query = PM_Case.where({ _id:c_id, proposer: u_id });
    query.findOneAndRemove(function (err){
        if(err)
            callback(err);
        else
            callback(null);
    });
}

exports.listMyCase = function(id, callback) {
    var query = PM_Case.where({ proposer: id });
    query.find(function(err, pm_cases){
        if(err)
            callback(err);
        if(pm_cases)
            callback(null, pm_cases);
        else
            callback(null, null);
    });
}


exports.getMyCase = function () {

}
