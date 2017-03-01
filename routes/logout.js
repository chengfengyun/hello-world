var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('logout');
    // res.render('users', { title: 'users' });
});

module.exports = router;