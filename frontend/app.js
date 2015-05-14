var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var requireTree = require('require-tree');

var MongoStore = require('connect-mongo')(session);

// connect to mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jsim', function(err) {
    if (err) {
        console.error("Unable to connect to MongoDB server", err);
        process.exit(-1);
        return;
    }
});

// initialize models
var models = requireTree('./routes/models/');

// routes
var templates = require('./routes/templates');
var api = require('./routes/api');
var auth = require('./routes/auth');

var myLogger = require('./routes/util/Logger');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.locals.partials = {
    welcome: "partials/welcome"
};

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,  // session will be changed by passportJS anyway
    //cookie: {
    //    maxAge: 60000
    //},
    store: new MongoStore({
            db: mongoose.connection.db.databaseName
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        })
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(myLogger.express.bind(myLogger));

app.use('/user', templates);  // do not check auth at login/register pages
app.use('/api', auth.check, api);
app.use('/auth', auth);
app.use('/', auth.check, templates);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});


module.exports = app;
