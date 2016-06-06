var mongoose = require('mongoose');
var fs = require('fs');
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
    //console.log(query);
    query.findOneAndRemove(function (err, pm_case){
        if(err)
            callback(err);
        else if(pm_case){
            if(pm_case.status!="finding"){
                callback(null);
                return;
            }
            else{
                var file_path = "./uploads/images/"+pm_case.image_name;
                fs.unlink(file_path, function(err){
                    if(err)
                        console.log(err);
                    else
                        console.log("File deleted successfully!");
                    callback(null);
                });
            }
        }
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
