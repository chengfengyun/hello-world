var express = require('express');
//使用 express.Router 类创建模块化、可挂载的路由句柄。Router 实例是一个完整的中间件和路由系统，因此常称其为一个 “mini-app”。下面的实例程序创建了一个路由模块，并加载了一个中间件，定义了一些路由，并且将它们挂载至应用的路径上
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: '首页'
    });
});
//返回router，供app使用
module.exports = router;