// MONGODB sudo systemctl start mongodb
// MONGODB sudo systemctl start mongod
var express = require('express');
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var flash = require('connect-flash');
var path = require('path');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var usersOnline = {};

var auth = require('./routes/auth.js');
var mainConfig = require('./config/mainConfig.js');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

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

//TEMP ROUTES========================================================================
var Sentence = require('./model/rundomSentence.js');
// app.get('/sentence/add', function(req, res){
//   var someText = 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
//   var newSentence = new Sentence ({
//     text: someText,
//     length: someText.length
//   });
//   Sentence.saveNewSentence(newSentence, function(err, sentence){
//     if (err) throw err;
//     if (sentence){
//       res.send('New Sentence Added');
//     }else{
//       req.send('Something went wrong');
//     }
//   });
// });

// app.get('/sentence/get_by_length', function(req, res){
//   var length = 40;
//   Sentence.getByLength(length, function(err, sentences){
//     if (err) throw err;
//     if (sentences) {
//       var randomItem = sentences[Math.floor(Math.random()*sentences.length)];
//       res.send(JSON.stringify(randomItem));
//     }else{
//       req.send('Something went wrong');
//     }
//   });
// });

// app.get('/sentence/get_all', function(req, res){
//   Sentence.getAll(function(err, sentences){
//     if (err) throw err;
//     if (sentences) {
//       res.send(JSON.stringify(sentences.length));
//     }else{
//       req.send('Something went wrong');
//     }
//   });
// });

// app.get('/file/read', function(req, res){
//   fs.readFile('./import/sentences.txt', {encoding: 'utf-8'}, function(err, data) {
//     var sentencesArray = data.split('. ');

//     sentencesArray.forEach(function(sentence) {
//       var sentenceText = sentence.replace(".", "");
//       if (sentenceText.length >= 15){
//         var newSentence = new Sentence ({
//           text: sentenceText,
//           length: sentenceText.length
//         });
//         Sentence.saveNewSentence(newSentence, function(err, sent){
//           if (err) throw err;
//         });
//       }
//     });

//     res.send('OK');
//   });
// });
//====================================================================================

app.use(function(req, res, next) {
  //verify token in cookies
  jwt.verify(req.cookies.auth_token, 'secretkey', (err, authData) => {
    if(err) {
      //if token expires, redirect on login page
      res.redirect('/authentication/login');
    } else {
      //if token not expires, generate new token,set in cookie and go next
      jwt.sign({authUser: authData.authUser}, 'secretkey', {expiresIn: '300s'}, (err, newToken) => {
        res.cookie('auth_token', newToken);
        next();
      });
    }
  });
});

app.get('/', function(req, res) {
  res.render("main/homePage.ejs", {
    title: mainConfig.homeTitle,
    username: req.cookies.username,
    messages: req.flash()
  });
});

app.get('/battle/start', function(req, res) {
  var length = 150;
  Sentence.getByLength(length, function(err, sentences){
    if (err) throw err;
    if (sentences) {
      var randomItem = sentences[Math.floor(Math.random()*sentences.length)];
      res.send(JSON.stringify({battleSentence: randomItem.text}));
    }else{
      res.send(JSON.stringify({error: 'Something went wrong'}));
    }
  });
});

io.on('connection', function(socket){

  socket.on('add-user', function(data){
    socket.join('main room');
    socket.leave(socket.id);

    if (usersOnline[data.username] !== undefined) {
      delete usersOnline[data.username];
      io.sockets.sockets[socket.id].disconnect();
    }
    usersOnline[data.username] = {
      "socket": socket.id
    };

    console.log(usersOnline);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  // console.log(io.sockets.adapter.rooms);
  // console.log(socket);
});

http.listen(3000, function(){
  console.log('Server started on port 3000...');
});

// app.listen(3000, function(){
//   console.log('Server started on port 3000...');
// });




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
