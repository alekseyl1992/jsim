var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/report', function(req, res, next) {
  res.render('report', { title: 'Express' });
});

router.get('/experiment', function(req, res, next) {
  res.render('experiment', { title: 'Express' });
});

module.exports = router;
