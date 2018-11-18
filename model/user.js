//Mongoose connection to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/flg', {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to DB successfully...');
});

//Crypt for hash password
var bcrypt = require('bcryptjs');

/**
 * [UserSchema for DB]
 * @type {[object]}
 */
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index:true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  battleStatus: {
    type: String
  },
  oponent: {
    type: String
  },
  cps: {
    type: Number
  }
});

/**
 * [User object with schema]
 * @type {[object]}
 */
var User = module.exports = mongoose.model('User', UserSchema);

/**
 * [getByUsername (get one user data from DB by username)]
 * 
 * @param  {[string]}   username
 * @param  {Function}   callback
 * @return {[json]}     [error && user]
 *
 * UserModel.getByUsername('username', function (err, user) {...}
 */
module.exports.getByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}

module.exports.getUsersForBattle = function(query, callback){
  User.find(query, callback).limit(2);
}

/**
 * [getAll (get all user data in array from DB)]
 * 
 * @param  {Function}   callback
 * @return {[array]}    [error && array(users)]
 *
 * UserModel.getAll(function (err, users) {...}
 */
module.exports.getAll = function(callback){
  User.find(callback);
}

/**
 * [saveNewUser (save new user data to DB)]
 * @param  {[object]}   newUser
 * @param  {Function}   callback
 * @return {[array]}    [error && user]
 *
 * var newUser = new User ({
 *   username: 'someUsername',
 *   password: 'somePassword',
 *   email: 'some@email.com',
 *   name: 'someName'
 * });
 * UserModel.saveNewUser(newUser, function (err, user) {...}
 */
module.exports.saveNewUser = function(newUser, callback){
  bcrypt.genSalt(15, function(err, salt) {
    if(err) throw err;
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

/**
 * [comparePassword]
 * @param  {[string]}   candidatePassword [not hashed password]
 * @param  {[string]}   hash              [hashed password from DB]
 * @param  {Function}   callback
 * @return {[bool]}
 *
 * UserModel.comparePassword(candidatePassword, passwordDB, function (err, isMatch) {...}
 */
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}
