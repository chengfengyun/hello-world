var express = require('express');
var path = require('path');

//通过使用第三方中间件从而为 Express 应用增加更多功能。
//安装所需功能的 node 模块，并在应用中加载，可以在应用级加载，也可以在路由级加载
//此处在应用级加载
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var connect = require('connect-mongo'); //
var flash = require('connect-flash');
var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use 是Express 添加中间件的一种方法
// app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了
//if你提供给 express.static 函数的路径是一个相对node进程启动位置的相对路径。如果你在其他的文件夹中启动express app，更稳妥的方式是使用静态资源文件夹的绝对路径path.join(__dirname
app.use(express.static(path.join(__dirname, 'public')));
//==  app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(cookieParser());

app.use(session({
    secret: settings.cookieSecret,
    key: settings.db, //cookiename
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, //30days
    resave: false,
    store: new MongoStore({
        // db: settings.db
        url: 'mongodb://localhost/' + settings.db
    }, function() {
        console.log('connect mongodb success...');
    })
}));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.errors = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.infos = req.flash('info');
    next();
});

// 在应用中加载路由模块,应用即可处理发自 / 和 /users/的请求。
// app.use('/users', users);
var index = require('./routes/index');
var reg = require('./routes/reg');
var login = require('./routes/login');
var logout = require('./routes/logout');
var post = require('./routes/post');
app.use('/', index);
app.use('/reg', reg);
app.use('/post', post);
app.use('/login', login);
app.use('/logout', logout);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error'); // views/error.jade
});
app.listen(3000);
console.log('listening on 3000');
module.exports = app;