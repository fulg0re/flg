// MONGODB sudo systemctl start mongodb

var express = require('express'),
  bodyParser = require('body-parser');

var User = require('./model/user.js');



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
