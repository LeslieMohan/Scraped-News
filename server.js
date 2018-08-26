// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var router = express.Router();

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Requiring Comment and Article models
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Scraped-News";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
//mongoose.connect("mongodb://localhost/Scraped-News");
var db = mongoose.connection;

//Define port
var port = process.env.PORT || 3000

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});

//GET requests to render Handlebars pages
app.get("/", function (req, res) {
  Article.find({}, function (error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("home", hbsObject);
  });
});


// A GET request to scrape the  website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  request("https://www.sportsnet.ca", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h3 within an title tag, and do the following:
    $(".featured-link").each(function (i, element) {

      // Save an empty result object
      var result = {};

      // Save the text of the element in a "title" variable
      var title = $(element).children(".featured-list").children("h4").text();
      result.title = title;

      var link = $(element).attr("href");
      result.link = link;

      console.log(result);



      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function (err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          // console.log(doc);
        }
      });

    });

    res.send("Scrape Complete");
    // Log the results once you've looped through each of the elements found with cheerio

  });
  // Tell the browser that we finished scraping the text
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function (req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function (error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Listen on port
app.listen(port, function () {
  console.log("App running on port " + port);
});
