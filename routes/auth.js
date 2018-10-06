var express = require('express');
var router = express.Router();

var User = require('../model/user.js');

router.get('/login', function(req, res){
  res.render("user/loginPage.ejs", {
    title: 'Login page',
    error: null
  });
});

module.exports = router;
