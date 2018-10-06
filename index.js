// MONGODB sudo systemctl start mongodb
var express = require('express');
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var path = require('path');
var localStorage = require('localStorage')
var auth = require('./routes/auth.js');

var app = express();

app.engine('ejs', engine);

// app SETs...
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app USEs...
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/authentication', auth);

app.get('/', function(req, res) {
  // TO DO...
  res.redirect("/authentication/login");
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
