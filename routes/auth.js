var express = require('express');
var router = express.Router();

var User = require('../model/user.js');
var mainConfig = require('../config/mainConfig.js');

router.get('/login', function(req, res){
  res.render("user/loginPage.ejs", {
    title: mainConfig.loginTitle,
    messages: req.flash()
  });
});

router.post('/login', function(req, res){
  //TO DO
});

router.get('/register', function(req, res){
  res.render("user/registerPage.ejs", {
    title: mainConfig.registerTitle,
    messages: req.flash()
  });
});

router.post('/register', function(req, res){
  var newUser = new User ({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    name: req.body.name
  });

  if (newUser.password != req.body.passwordConfirmation){
    req.flash('error', 'Paswords do not match');
    res.redirect('/authentication/register');
  }else{
    User.getByUsername(newUser.username, function(err, user){
      if (err) throw err;
      if (user != null) {
        req.flash('error', 'User already exists');
        res.redirect('/authentication/register');
      }else{
        User.saveNewUser(newUser, function(err, user){
          if (err) throw err;
          if (user){
            req.flash('success', 'Registration is successful. You can login now.');
            res.redirect('/authentication/login');
          }else{
            req.flash('error', 'Something went wrong.');
            res.redirect('/authentication/register');
          }
        });
      }
    });
  }
});

module.exports = router;
