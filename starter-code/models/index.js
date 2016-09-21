var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo-app');

var Person = require('./person');
// var Todo = require('./todo');

exports.Person = Person;
// exports.Todo = Todo;