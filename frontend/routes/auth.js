var express = require('express');
var _ = require('lodash');

var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('mongoose').model('user');

//TODO: add md5 and some salt
function validatePassword(user, password) {
    return user.password === password;
}

function createPassword(password) {
    return password;
}

function check(req, res, next) {
    if (req.isAuthenticated())
        next();
    else
        res.redirect('/user/login');
}

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function(username, password, done){
    User.findOne({ username: username }, function (err, user) {
        if (err)
            return done(err);

        if (!user)
            return done(null, false, {
                message: 'Wrong username or password'
            });

        if (!validatePassword(user, password))
            return done(null, false, {
                message: 'Wrong username or password'
            });

        return done(null, user);
    });
}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if (err)
            done(err);
        else
            done(null, user);
    });
});

router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })
);

router.all('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.post('/register', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        req.flash('error', "Missing credentials");
        return res.redirect('/user/register');
    }

    var user = new User({
        username: req.body.username,
        password: createPassword(req.body.password)
    });

    user.save(function(err) {
        if (err) {
            // dup entry?
            if (err.code == 11000) {
                req.flash('error', "Username already in use");
                return res.redirect('/user/register');
            }

            return next(err);
        }

        req.logIn(user, function(err) {
            if (err)
                return next(err);
            else
                return res.redirect('/');
        });
    });
});

module.exports = router;
module.exports.check = check;