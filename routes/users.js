var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resourc');
    // res.render('users', { title: 'users' });
});

module.exports = router;