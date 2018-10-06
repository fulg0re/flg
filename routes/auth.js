var express = require('express');
var router = express.Router();

// router.use(bodyParser());

var User = require('../model/user.js');
var mainConfig = require('../config/mainConfig.js');

router.get('/login', function(req, res){
  res.render("user/loginPage.ejs", {
    title: mainConfig.loginTitle,
    errors: null,
    successes: null,
    infos: null,
    warnings: null
  });
});

router.post('/login', function(req, res){
  //TO DO
});

router.get('/register', function(req, res){
  res.render("user/registerPage.ejs", {
    title: mainConfig.registerTitle,
    errors: null,
    successes: null,
    infos: null,
    warnings: null
  });
});

router.post('/register', function(req, res){
  var userInput = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  };

  if (userInput.password != userInput.passwordConfirmation){
    res.render("user/registerPage.ejs", {
      title: mainConfig.registerTitle,
      errors: ['Paswords do not match'],
      successes: null,
      infos: null,
      warnings: null
    });
  }

  // User.comparePassword(userInput.);

  // var newUser = new User ({
  //   username: req.body.username,
  //   password: 'qwe',
  //   email: 'pp@pp.pp',
  //   name: 'Pavlo'
  // });
  // User.saveNewUser(newUser, function (err, user) {
  //   if(err) throw err;
  //   console.log(`New user ${user.username} added successfully...`);
  // });
});

module.exports = router;
