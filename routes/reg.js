var router = require('express').Router();

var crypto = require('crypto'),
    User = require('../models/user.js');

router
    .get('/', function(req, res, next) {
        res.render('reg', { title: '注册' });
    })
    .post('/', function(req, res) {
        var name = req.body.name,
            password = req.body.password,
            // pasword_re = req.body['password-repeat'];
            password_re = req.body.password_re,
            email = req.body.email;
        //昵称不能为空
        if (name == '') {
            req.flash('error', '昵称不能为空!');
            return res.redirect('/reg'); //返回注册页
        }
        //密码不能为空
        if (password == '') {
            req.flash('error', '密码不能为空!');
            return res.redirect('/reg'); //返回注册页
        }
        if (password_re != password) {
            req.flash('error', '两次输入密码不一样');
            return res.redirect('/reg'); //返回注册的首页
        }
        //邮箱不能为空
        if (email == '') {
            req.flash('error', '邮箱不能为空!');
            return res.redirect('/reg'); //返回注册页
        }
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        User.get(newUser.name, function(err, user) {
            if (user) {
                req.flash('error', '用户已存在');
                return res.redirect('/reg');
            }
            newUser.save(function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = user;
                req.flash('success', '注册成功');
                res.redirect('/');
            });
        });
    });
module.exports = router;