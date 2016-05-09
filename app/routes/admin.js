module.exports = function(app) {

var express = require('express');
var router = express.Router();

/* GET home page. */
app.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'AdminPanel' });
});

};