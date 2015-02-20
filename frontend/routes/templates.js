var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        user: {
            name: req.user.username
        }
    });
});

router.get('/report', function(req, res, next) {
    res.render('report', { title: 'Express' });
});

router.get('/experiment', function(req, res, next) {
    res.render('experiment', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
    res.render('register', { error: req.flash('error') });
});

router.get('/login', function(req, res, next) {
    res.render('login', { error: req.flash('error') });
});

module.exports = router;
