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

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(username, password, done){
    User.findOne({ username: username }, function (err, user) {
        if (err)
            return done(err);

        if (!user)
            return done(null, false, {
                message: 'Incorrect username'
            });

        if (!validatePassword(user, password))
            return done(null, false, {
                message: 'Incorrect password'
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
        failureRedirect: '/auth',
        failureFlash: true
    })
);

router.post('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.post('/register', function(req, res, next) {
    var user = new User({
        username: req.body.email,
        password: createPassword(req.body.password)
    });

    //TODO: fuck this shit
    user.save(function(err) {
        if (err)
            return next(err);

        req.logIn(user, function(err) {
            if (err)
                return next(err);
            else
                return res.redirect('/');
        });
    });
});

module.exports = router;