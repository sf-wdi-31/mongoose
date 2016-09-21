var mongoose = require('mongoose');

// connect to mongodb
mongoose.connect('mongodb://localhost/todo-app');

var Todo = require('./todo');

exports.Todo = Todo;