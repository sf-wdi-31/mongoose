/************
 *  Config  *
 ************/

// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    PORT = 3000;

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));


/************
 * Mongoose *
 ************/

// use native JS promise library instead of Mongoose's deprecated one
mongoose.Promise = global.Promise;
// require Todo model
var db = require('./models');


/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

// get all todos
app.get('/api/todos', function index(req, res) {
  // find all todos in db
  db.Todo.find(function (err, allTodos) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ todos: allTodos });
    }
  });
});

// create new todo
app.post('/api/todos', function create(req, res) {
  // create new todo with form data (`req.body`)
  var newTodo = new db.Todo(req.body);

  // save new todo in db
  newTodo.save(function(err, savedTodo) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(savedTodo);
    }
  });
});

// get one todo
app.get('/api/todos/:id', function show(req, res) {
  // get todo id from url params (`req.params`)
  var todoId = req.params.id;

  // find todo in db by id
  db.Todo.findOne({ _id: todoId }, function(err, foundTodo) {
    if (err) {
      if (err.name === "CastError") {
        res.status(404).json({ error: "Nothing found by this ID." });
      } else {
        res.status(500).json({ error: err.message });
      }
    } else {
      res.json(foundTodo);
    }
  });
});

// update todo
app.put('/api/todos/:id', function update(req, res) {
  // get todo id from url params (`req.params`)
  var todoId = req.params.id;

  // find todo in db by id
  db.Todo.findOne({ _id: todoId }, function(err, foundTodo) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // update the todos's attributes
      foundTodo.task = req.body.task;
      foundTodo.description = req.body.description;

      // save updated todo in db
      foundTodo.save(function(err, savedTodo) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(savedTodo);
        }
      });
    }
  });
});

// delete todo
app.delete('/api/todos/:id', function destroy(req, res) {
  // get todo id from url params (`req.params`)
  var todoId = req.params.id;
  // find todo in db by id and remove
  db.Todo.findOneAndRemove({ _id: todoId }, function (err, deletedTodo) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(deletedTodo);
    }
  });
});



/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(PORT, function() {
  console.log("Server running on port", PORT);
});
