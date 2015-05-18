var express = require('express');
var crypto = require('crypto');
var _ = require('lodash');

var StringRes = require('./util/StringRes');
var s = {
    login: StringRes.getLocalizedStrings('login'),
    register: StringRes.getLocalizedStrings('register')
};

var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('mongoose').model('user');

function validatePassword(user, password) {
    return user.password === createPassword(password);
}

function createPassword(password) {
    var sha256 = crypto.createHash('sha256')
        .update(password)
        .update(salt(password))
        .digest("hex");
    return sha256;
}

function salt(password) {
    return _.reduce(
        _.sortBy(password),
        function (ch, result) {
            return result + ch;
        });
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
                message: s.login.wrongLoginOrPassword
            });

        if (!validatePassword(user, password))
            return done(null, false, {
                message: s.login.wrongLoginOrPassword
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
        failureFlash: true,
        badRequestMessage: s.login.missingCredentials
    })
);

router.all('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.post('/register', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        req.flash('error', s.register.missingCredentials);
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
                req.flash('error', s.register.alreadyInUse);
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