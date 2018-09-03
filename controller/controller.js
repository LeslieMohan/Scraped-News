//dependencies
var express = require('express');
var router = express.Router();
var path = require('path');

//require request and cheerio to scrape
var request = require('request');
var cheerio = require('cheerio');

//Require models
var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');

//index
router.get('/', function(req, res) {
    res.redirect('/articles');
});

// A GET request to scrape the sportsnet website
router.get('/scrape', function(req, res) {
    //grab the body of the html with request
    request('http://www.nhl.com', function(error, response, html) {
        //load into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        var titlesArray = [];
        // get every article
        $('.mixed-feed__item-header-text').each(function(i, element) {
            // Save as an empty result object
            var result = {};

            // Add the text and href of every link
            //save as properties of the result object
            result.title = $(this).children("a").children('h4').text();
            result.summary = $(this).children("a").children('h5').text();
            result.link = $(this).children("a").attr('href');

            //make sure no empty title or links are sent to mongodb
            if(result.title !== "" && result.link !== ""){
                //make sure no duplicates
                if(titlesArray.indexOf(result.title) == -1){

                    // push saved title to the array 
                    titlesArray.push(result.title);

                        // only add the article if is not already there
                        Article.count({ title: result.title}, function (err, test){
                        //if the test is 0, the entry is unique and good to save
                        if(test == 0){

                        //using Article model, create new object
                        var entry = new Article (result);

                        //save entry to mongodb
                        entry.save(function(err, doc) {
                             if (err) {
                                console.log(err);
                            } else {
                                console.log(doc);
                            }
                        });

                    }
                });
            }

        // Log that scrape is working
        else{
          console.log('This article exists already.')
        }

          }
          // Log that scrape is working, just the content was missing parts
          else{
            console.log('Not saved to DB, missing data')
          }
        });
        // after scraping, its redirected to index
        res.redirect('/');
    });
});

//get every article to populate the DOM
router.get('/articles', function(req, res) {
    //put newer articles at the top
    Article.find().sort({_id: -1})
        //send to handlebars
        .exec(function(err, doc) {
            if(err){
                console.log(err);
            } else{
                var artcl = {article: doc};
                res.render('index', artcl);
            }
    });
});

// get the articles scraped from the mongoDB in JSON
router.get('/articles-json', function(req, res) {
    Article.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

//clear all articles for test
router.get('/clearAll', function(req, res) {
    Article.remove({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('removed all articles');
        }

    });
    res.redirect('/articles-json');
});

router.get('/readArticle/:id', function(req, res){
  

    // //find the article at the id
    Article.findOne({ _id: req.params.id })
      .populate('comment')
      .exec(function(err, doc){
      if(err){
        console.log('Error: ' + err);
      } else {
        

          
            //send article body and comments to article.handlbars
            res.render('article', { article: doc });
            //prevents loop through so it doesn't return an empty hbsObj.body
            return false;
          };
        
      });

});
  


// Create a new comment
router.post('/comment/:id', function(req, res) {
  var user = req.body.name;
  var content = req.body.comment;
  var articleId = req.params.id;

  //submitted form
  var commentObj = {
    name: user,
    body: content
  };
 
  //using the Comment model, create a new comment
  var newComment = new Comment(commentObj);

  newComment.save(function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log(doc._id)
          console.log(articleId)
          Article.findOneAndUpdate({ "_id": req.params.id }, {$push: {'comment':doc._id}}, {new: true})
            //execute everything
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/readArticle/' + articleId);
                }
            });
        }
  });
});

module.exports = router;