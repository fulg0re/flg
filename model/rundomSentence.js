//Mongoose connection to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/flg', {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to DB successfully...');
});

/**
 * [SentenceSchema for DB]
 * @type {[object]}
 */
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

/**
 * [getByLength]
 * @param  {[int]}      length
 * @param  {Function}   callback
 * @return {[array]}   [sentences from DB]
 *
 * Sentence.getByLength(length, function(err, sentences){...}
 */
module.exports.getByLength = function(length, callback){
  var query = {length: length};
  Sentence.find(query, callback);
}

/**
 * [getAll (get all sentences from DB)]
 * @param  {Function}   callback
 * @return {[array]}
 *
 * Sentence.getAll(function(err, sentences){...}
 */
module.exports.getAll = function(callback){
  Sentence.find(callback);
}

/**
 * [saveNewSentence]
 * @param  {[string]}   newSentence
 * @param  {Function}   callback
 * @return {[type]}               [description]
 *
 * Sentence.saveNewSentence(newSentence, function(err, sent){...}
 */
module.exports.saveNewSentence = function(newSentence, callback){
  newSentence.save(callback);
}
