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
var usersOnline = [];
var battleRooms = [];

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

var Sentence = require('./model/rundomSentence.js');

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

var User = require('./model/user.js');

io.on('connection', function(socket){

  socket.on('addUser', function(data){
    socket.join('main room');
    socket.leave(socket.id);
    if (usersOnline[data.username] === undefined) {
      usersOnline[data.username] = [socket.id];
    } else {
      usersOnline[data.username].push(socket.id);
    }
    console.log(`user "${data.username}" connected with socket "${socket.id}"`);
  });

  socket.on('readyForBattrle', function(data){
    User.getByUsername(data.username, function(err, userDB){
      if (err) throw err;
      userDB.battleStatus = 'ready for battle';
      userDB.save();

      /** find 2 oponents for battle */
      var query = {
        battleStatus: 'ready for battle',
        cps: userDB.cps
      };
      User.getUsersForBattle(query, function(err, users){
        if (err) throw err;
        if (users.length > 1) {
          var roomIndex = new Date().getTime();
          var roomName = 'room' + roomIndex;
          users.forEach(function(user){
            if (battleRooms[roomName] === undefined) {
              battleRooms[roomName] = [user.username];
            } else {
              battleRooms[roomName].push(user.username);
            }
            user.battleStatus = 'in battle';
            user.save();
            /** TODO send for users redirect socket... */
          });
        }
      });
    });
  });

  socket.on('disconnect', function(){
    for (var user in usersOnline) {
      var index = usersOnline[user].indexOf(socket.id.toString());
      if (index > -1) {
        usersOnline[user].splice(index, 1);
        console.log(`user "${user}" disconnected with socket "${socket.id}"`);
      }
    }
  });
});

http.listen(3000, function(){
  console.log('Server started on port 3000...');
});

//TEMP ROUTES========================================================================
// var Sentence = require('./model/rundomSentence.js');
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
