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
// var bcrypt = require('bcryptjs');

// Sentence Schema
var SentenceSchema = mongoose.Schema({
  text: {
    type: String,
    index:true
  },
  length: {
    type: Number
  }
});

var Sentence = module.exports = mongoose.model('Sentence', SentenceSchema);

module.exports.getByLength = function(length, callback){
  var query = {length: length};
  Sentence.find(query, callback);
}

module.exports.getAll = function(callback){
  Sentence.find(callback);
}

module.exports.saveNewSentence = function(newSentence, callback){
  newSentence.save(callback);
}
