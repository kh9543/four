var mongoose = require('mongoose');
var options = {
    user: 'public',
    pass: '@group4'
}
module.exports = mongoose.connect('mongodb://localhost/four', options);
