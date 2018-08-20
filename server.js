// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// Set up port
var PORT = process.env.PORT || 3000;

// Set up Express App
var app = express();

// Require routes
var routes = require("./routes");

// Designate our public folder as a static directory
app.use(express.static("public"));

// Connect Handlebars to Express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Have every request go through route middleware
app.use(routes);

// Use the deployed database or local
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/users";

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useNewUrlClient:true
});


// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});