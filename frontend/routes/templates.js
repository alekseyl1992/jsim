var express = require('express');
var router = express.Router();
var StringRes = require('./util/StringRes');

router.get('/', function(req, res, next) {
    res.render('index', {
        s: StringRes.getLocalizedStrings('index'),
        user: {
            name: req.user.username
        }
    });
});

router.get('/report', function(req, res, next) {
    res.render('report', {
        s: StringRes.getLocalizedStrings('report')
    });
});

router.get('/experiment', function(req, res, next) {
    res.render('experiment', {
        s: StringRes.getLocalizedStrings('experiment')
    });
});

router.get('/register', function(req, res, next) {
    res.render('register', {
        s: StringRes.getLocalizedStrings('register'),
        error: req.flash('error')
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        s: StringRes.getLocalizedStrings('login'),
        error: req.flash('error')
    });
});

module.exports = router;
