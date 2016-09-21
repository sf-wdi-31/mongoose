// Remove the error when complete...
var helpfulError = new Error("FIRST CREATE A TODO MODEL & REQUIRE IT IN INDEX.JS!");
throw helpfulError;

var Todo = require('./todo');

exports.Todo = Todo;