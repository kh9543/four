var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '四人幫' , user: req.user});
});

router.get('/login', function(req, res, next){
    res.render('login', {title: 'Login'})

});

function ensureAuthenticated(req, res, next) {
	//check ID in session to see if authenticated
}


module.exports = router;
