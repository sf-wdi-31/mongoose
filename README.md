<!--
Creator: Cory Fauver
Market: SF
-->

![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)

# Mongo and Mongoose

### Why is this important?
<!-- framing the "why" in big-picture/real world examples -->
*This workshop is important because:*

Arrays are not a good place to store data permanently. We have been adding objects to arrays in our server side code in order to keep track of the data that's coming and going. When we restart server.js, any changes that we made to the data are lost! We need to be able to talk to a *database* that is outside of our server code in order to store information for the long-term. MongoDB is a popular database that is often used in conjunction with full stack JavaScript applications. Mongoose is a package built to make communication with MongoDB as easy as possible.

### What are the objectives?
<!-- specific/measurable goal for students to achieve -->
*After this workshop, developers will be able to:*

- Differentiate and relate the concepts of schemas and models in Mongoose.
- Create Mongoose schemas & models and use Mongoose model instances.
- Describe the relationship between Mongoose with Express and integrate the two in their projects.


### Where should we be now?
<!-- call out the skills that are prerequisites -->
*Before this workshop, developers should already be able to:*

- Use Express to configure a server's responses to various HTTP verbs on various routes.
- access data that comes in on a request from the client-side (`req.body` or `req.params`).

|

## Review: What are Mongo and Mongoose?

![tumblr_nbhme6bafu1s02vreo1_500](https://cloud.githubusercontent.com/assets/4304660/16811532/b08865a8-48dd-11e6-9474-c114b2e8a00d.gif)

`MongoDB` is a no-SQL database. It is responsible for putting data in containers and making sure that the data is safe and organized. `Mongoose` is a library or "wrapper" that gives us a bunch of convenience methods for working with MongoDB records (kind of like jQuery's convenience methods for manipulating the DOM). Generally we will not be interacting _directly_ with MongoDB, instead we'll be working with `mongoose`.

<details><summary>Side-note: Wondering what makes noSQL different from SQL? (we'll talk more about this later)</summary>

There are two main categories of databases: relational (SQL) databases, and non-relational (no-SQL) databases. Mongo is a no-SQL database that stores entries in a JSON-like format.

Since Mongo is the first database we've worked with it's hard for us to discuss the tradeoffs between SQL/no-SQL. But here's a great analogy from a fellow on StackOverflow:
> "NoSQL databases store information like you would recipes in a book. When you want to know how to make a cake, you go to that recipe, and all of the information about how to make that cake (ingredients, preparation, mixing, baking, finishing, etc.) are all on that one page.
>
> SQL is like shopping for the ingredients for the recipe. In order to get all of your ingredients into your cart, you have to go to many different aisles to get each ingredient. When you are done shopping, your grocery cart will be full of all the ingredients you had to run around and collect.
>
> Wouldn’t it be nicer if there was a store that was organized by recipe, so you could go to one place in the store and grab everything you need from that one spot? Granted you’ll find ingredients like eggs in 50 different places, so there’s a bit of overhead when stocking the shelves, but from a consumer standpoint it would be much easier/faster to find what they're looking for."

-<a href="http://stackoverflow.com/questions/14428069/sql-and-nosql-analogy-for-the-non-technical/14428221#14428221" target="_blank">mgoffin, Jan 20 '13 at 19:15</a>

</details>


## Schemas and Models

Mongoose presents us with two key concepts for how we create and store data in our Mongo database.

**[Schema](http://mongoosejs.com/docs/guide.html)**: A Schema is a diagram or blueprint for what every object in the noSQL database will contain. It does not include any methods, just placeholders for what data you will eventually store. Here's an example of a simple Address Book mongoose schema:

```js
    var ContactSchema = new Schema({
        firstName: String,
        lastName: String,
        address: String,
        phoneNumber: Number,
        email: String,
        professionalContact: Boolean
    });
```

With the above Schema, we can expect that all of our Address Book entries would have a first name, last name, address, and email address in the form of Strings. We can count on the phoneNumber to always be accepted, stored, and returned as a number. Lastly, the boolean value of Professional Contact will always be a true or false. A Schema has no functionality. It simply defines the shape of the data that we will expect when we work with contacts.

**[Model](http://mongoosejs.com/docs/models.html)**: A mongoose model is compiled from a Schema. It takes in the structure and shape of a Schema and adds the capacity to perform actions such as reading, saving, updating, etc. The Schema is just an inert mould to make sure that the models will hold the data consistently. A model is actually capable of creating new entries in a database and retrieving data from the database. Here's how you'd make a Contact model out of our Contact Schema:

```js
var Contact = mongoose.model('Contact', ContactSchema);
```

> In mongoose, a schema represents the structure of a particular document, either completely or just a portion of the document. It's a way to express expected properties and values as well as constraints and indexes. A model defines a programming interface for interacting with the database (read, insert, update, etc). So a schema answers "what will the data in this collection look like?" and a model provides functionality like "Are there any records matching this query?" or "Add a new document to the collection".

> *[Source: Peter Lyons on stackoverflow](http://stackoverflow.com/questions/22950282/mongoose-schema-vs-model/22950402#22950402)*



![image](https://i.chzbgr.com/full/7986468352/hE55E1B66/)

Factory metaphor: Imagine a factory that has a mold for making rubber ducks. The mold would be the Schema. The machine that is capable of putting the different colored plastic into the mold, pressing it, and delivering a new toy to the world would be the model. The toy itself would be the data that would now be stored in some packaging in your database.

![image](https://cloud.githubusercontent.com/assets/6520345/18133637/3e2d48e0-6f50-11e6-80c7-0336334d8c91.png)

## Mongo & Mongoose setup

Let's do a quick activity and get Mongoose and Mongo setup on our machines.

1. Assuming you already have MongoDB installed (you did this at installfest), to get started using mongoose in a project, we have to install it in our `package.json`:

  ```bash
    npm install --save mongoose
  ```

2. Next we need to `require` Mongoose in our project and `connect` to the MongoDB service (it could be local or hosted). We can do this in `server.js` for now. Later we'll do it in `models/index.js`.

  ```js
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/todo-app-demo');
  ```

    <details>
      <summary>What's a connection string?</summary>
      `mongodb://localhost/todo-app-demo` is a string to connect to a MongoDB database on your local system named `todo-app-demo`. You can name the system whatever you like and it will be created as soon as you save some data to it.
    </details>

3. Finally, we need to run the MongodDB service. Generally you will want it open in a separate tab, running in the background.

  ```bash
    mongod
  ```

    **Note:** If you already have an instance of MongoDB running, you'll get an error at this step. If that's the case, you can move on to the next step, since MongoDB is already running!

Running your MongoDB service is no different from running your Express Server!


## Express/MongoDB Integration
Once you've finished the above steps, here's how you would set up an Express application with a "Todo" model (so we can start CRUDing todos!).

1. In your Express application, create a folder called `models` with a file for your first model. In the example, we have a `Todo` model, so the filename is `todo.js`. Your folder structure should look similar to this:

  ```
  your-app-name
  ├── models
  │   └── todo.js
  ├── public
  │   ├── scripts
  │   │   └── main.js
  │   └── styles
  │       └── main.css
  ├── views
  │   └── index.html
  ├── .gitignore
  ├── package.json
  ├── README.md
  └── server.js
  ```

2. <details>
  <summary>In your model file (e.g. `todo.js`), create the model **schema**, and export it so that you can require it in other parts of your app.</summary>
  ```js
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var TodoSchema = new Schema({
    task: String,
    description: String
  });

  var Todo = mongoose.model('Todo', TodoSchema);

  module.exports = Todo;
  ```
</details>

3. <details>
  <summary>In `server.js`, require your model.</summary>
  ```js
  // server.js
  // Note without requiring your models you can't use them in server.js!
  var Todo = require('./models/todo');
  ```
</details>

#### Database IDs and data-types

Every model instance that we store in the database is assigned an ID.  In Mongo there will be a key of `_id` with a 24 character string.  We can use this ID later to look up a particular record.  Later on we'll look at how we can use those IDs can help us form relationships in the database.

Most databases also require that we specify the data-type for each attribute.  In mongoose we can use data-types from javascript such as String, Number, and even Array.

Let's look at this example:

```js
// models/person.js
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var personSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    height: Number,
    superPower: String,
    weakness: String,
    isExcited: Boolean
});

var Person = mongoose.model('Person', personSchema);

module.exports = Person;

```

In the above note how we've assigned **String**, **Number** and even a **Boolean** as the data-types for this Schema.

Let's create an instance of this model.

```js
  // server.js
  var Person = require('./models/person');

  var ilias = new Person({
      firstName: "Ilias",
      lastName: "Tsangaris",
      height: 6.0,
      superPower: "Puppy",
      weakness: "Puppy",
      isExcited: true
  });

  ilias.save(function(err, newPerson){
    if(err) {return console.log(err);}
    console.log("saved new person: ", newPerson);
  });
```

The above logs to the terminal the `newPerson` success object:

```bash
saved new person:  {
  __v: 0,
  firstName: "Ilias",
  lastName: "Tsangaris",
  height: 6.0,
  superPower: "Puppy",
  weakness: "Puppy",
  isExcited: true
  _id: 57866b9f9d89c840336a135e }

```

Notice that mongo has added an `_id` and `__v` attributes.


![](https://cloud.githubusercontent.com/assets/4304660/16811660/42d59d40-48de-11e6-99c5-3f68167c08bd.gif)


## CRUD Operations with Mongoose

Yesterday, when we wanted to access or manipulate stored data, we worked with an array. We were sending along the whole array, finding single objects in an array, adding objects to an array, and deleting elements from an array.

<details>
  <summary>At what API route did we complete each of the above?</summary>
  <ul>
    <li>
      sending along the whole array: GET /todos
    </li>
    <li>
      finding single objects in an array: GET /todos/:id
    </li>
    <li>
      adding objects to an array: POST /todos
    </li>
    <li>
      deleting elements from an array: DELETE /todos/:id
    </li>
</details>


Luckily, Mongoose provides methods to access the database data which will help us accomplish the same work as yesterday.

#### Get all todos: `.find()`

<details>
  <summary>We can use <a href="http://mongoosejs.com/docs/api.html#model_Model.find"  target="_blank">.find()</a> to get all documents in the collection.</summary>
  ```js
  // get all todos
  app.get('/api/todos', function todosIndex(req, res) {
    // find all todos in db
    Todo.find(function handleDBTodosListed(err, allTodos) {
      res.json({ todos: allTodos });
    });
  });
  ```

  **Note:** We can also use `.find()` to get a specific set of documents in the collection (rather than ALL documents) by setting conditions. Read more <a href="http://mongoosejs.com/docs/api.html#model_Model.find"  target="_blank">in the docs</a>.
</details>

#### Create new todo: `new` and `.save()`

<details>
  <summary>
  We've seen the `new` keyword before! It creates new instances of an object. We use it here to create new instances of our `Todo` model. We then call `.save()` to store the new todo in our database.</summary>
  ```js
  // create new todo
  app.post('/api/todos', function todosCreate(req, res) {
    // create new todo with form data (`req.body`)
    var newTodo = new Todo(req.body);

    // save new todo in db
    newTodo.save(function handleDBTodoSaved(err, savedTodo) {
      res.json(savedTodo);
    });
  });
  ```
</details>

#### Get one todo: `.findOne()`

<details>
  <summary>We can use <a href="http://mongoosejs.com/docs/api.html#query_Query-findOne">.findOne()</a> to return the first document in the collection that matches certain criteria. In this case, we're looking for a todo that has a certain `_id`.</summary>
  ```js
  // get one todo
  app.get('/api/todos/:id', function (req, res) {
    // get todo id from url params (`req.params`)
    var todoId = req.params.id;

    // find todo in db by id
    Todo.findOne({ _id: todoId }, function (err, foundTodo) {
      res.json(foundTodo);
    });
  });
  ```

  **Note:** The <a href="http://mongoosejs.com/docs/api.html#model_Model.findById" target="_blank">.findById()</a> method will also return a single document matching a specified id field.
</details>

#### Update todo: `.findOne()` and `.save()`

<details>
  <summary>Similar to the last example, we can use `.findOne()` to find the document with a certain `_id`. After updating the document, we use `.save()` to persist our changes to the database.</summary>
  ```js
  // update todo
  app.put('/api/todos/:id', function (req, res) {
    // get todo id from url params (`req.params`)
    var todoId = req.params.id;

    // find todo in db by id
    Todo.findOne({ _id: todoId }, function (err, foundTodo) {
      // update the todos's attributes
      foundTodo.task = req.body.task;
      foundTodo.description = req.body.description;

      // save updated todo in db
      foundTodo.save(function (err, savedTodo) {
        res.json(savedTodo);
      });
    });
  });
  ```
</details>

#### Delete todo: `.findOneAndRemove()`

<details>
  <summary>The <a href="http://mongoosejs.com/docs/api.html#model_Model.findOneAndRemove" target="_blank">.findOneAndRemove()</a> method takes care of finding the document with a certain `_id` and removing it from the database.</summary>
  ```js
  // delete todo
  app.delete('/api/todos/:id', function (req, res) {
    // get todo id from url params (`req.params`)
    var todoId = req.params.id;

    // find todo in db by id and remove
    Todo.findOneAndRemove({ _id: todoId }, function (err, deletedTodo) {
      res.json(deletedTodo);
    });
  });
  ```
  **Note:** Another way to remove the document is by finding the document first (using `.findOne()` or  `.findById()`) and calling <a href="http://mongoosejs.com/docs/api.html#model_Model.remove" target="_blank">`.remove()`</a>.
</details>


#### Robomongo: The MongoDB GUI
Exploring your databases with the MongoDB shell can be a chore. Robomongo is a free application that can make it a little easier on you: [Setting up Robomongo](https://scotch.io/tutorials/an-introduction-to-mongodb#gui-tool:-robomongo).

## Independent Practice
Practice the skills covered in this workshop with the [Mongoose books training](https://github.com/sf-wdi-31/mongoose-books-app)

## Closing Thoughts
- Recall: What was the rubber duck in the factory metaphor? What was the mold to make the duck? What abou the whole assembly line that actually builds ducks?
- This afternoon, we'll be looking at more complex relationships between entries in our databases.
- Right now, you should know how to set up the connections to Mongo in your app using mongoose in the models directory.
- This is our first dive into databases and will allow us to store data that will persist across time. That's a key feature to the internet - recognize how far you've come!

## Additional Resources
* [Scotch Tutorial: Intro to MongoDB](https://scotch.io/tutorials/an-introduction-to-mongodb)
* [MongoDB Shell Commands](https://docs.mongodb.org/manual/reference/mongo-shell/)
* [MongoDB CRUD Tutorials](https://docs.mongodb.org/manual/applications/crud/)
* <a href="http://mongoosejs.com/docs/api.html#model_Model.find" target="_blank">.find()</a>
* <a href="http://mongoosejs.com/docs/api.html#query_Query-findOne" target="_blank">.findOne()</a>
* <a href="http://mongoosejs.com/docs/api.html#model_Model.findById" target="_blank">.findById()</a>
* <a href="http://mongoosejs.com/docs/api.html#model_Model.findOneAndRemove" target="_blank">.findOneAndRemove()</a>
* <a href="http://mongoosejs.com/docs/api.html#model_Model.remove" target="_blank">.remove()</a>
