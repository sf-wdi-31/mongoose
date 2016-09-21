var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
  firstName: String,
  lastName: String,
  height: Number,
  superPower: String,
  weakness: String,
  isExcited: Boolean
});

var Person = mongoose.model('Person', personSchema);

module.exports = Person;