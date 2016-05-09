module.exports = function(app) {

var express = require('express');
var router = express.Router();

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

};
