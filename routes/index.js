var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing/index', {user: req.session});
});

function log_check(req, res, next) {
	//check ID in session to see if authenticated
}


module.exports = router;
