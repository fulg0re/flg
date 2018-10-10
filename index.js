// MONGODB sudo systemctl start mongodb
var express = require('express');
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var flash = require('connect-flash');
var path = require('path');
var jwt = require('jsonwebtoken');
var auth = require('./routes/auth.js');
var mainConfig = require('./config/mainConfig.js');

var app = express();

app.engine('ejs', engine);

// app SETs...
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app USEs...
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'some_secret_key',
  saveUninitialized: false,
  resave: false
}));
app.use(flash());
app.use('/authentication', auth);

app.use(function(req, res, next) {
  //verify token in cookies
  jwt.verify(req.cookies.auth_token, 'secretkey', (err, authData) => {
    if(err) {
      //if token expires, redirect on login page with message
      req.flash('error', 'Please login first...');
      res.redirect('/authentication/login');
    } else {
      //if token not expires, generate new token,set in cookie and go next
      jwt.sign({authUser: authData.authUser}, 'secretkey', {expiresIn: '30s'}, (err, newToken) => {
        res.cookie('auth_token', newToken);
        next();
      });
    }
  });
});

app.get('/', function(req, res) {
  res.render("main/homePage.ejs", {
    title: mainConfig.homeTitle,
    messages: req.flash()
  });
});

app.listen(3000, function(){
  console.log('Server started on port 3000...');
});

// //Working method!
// User.getByUsername('qwe', function (err, user) {
//   if (err) throw err;
//   console.log(user);
// });



// //Working method!
// User.getAll(function (err, users) {
//   if (err) throw err;
//   users.forEach(function(user) {
//     console.log(user);
//   });
// });



// //Working method!
// var newUser = new User ({
//   username: 'fulg0re',
//   password: 'qwe',
//   email: 'pp@pp.pp',
//   name: 'Pavlo'
// });
// User.saveNewUser(newUser, function (err, user) {
//   if(err) throw err;
//   console.log(`New user ${user.username} added successfully...`);
// });



// //Working method!
// var candidateUser = {
//   username: 'fulg0re',
//   password: 'qwe',
//   email: 'pp@pp.pp',
//   name: 'Pavlo'
// };
// User.getByUsername(candidateUser.username, function (err, user) {
//   if(err) throw err;
//   if (user) {
//     User.comparePassword(candidateUser.password, user.password, function (err, isMatch) {
//       if (err) throw err;
//       if (isMatch) {
//         console.log('Passwords is match');
//       } else {
//         console.log('Passwords do not match');
//       }
//     });
//   } else {
//     console.log('User not found!');
//   }
// });
