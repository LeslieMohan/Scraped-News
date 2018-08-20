var db = require("../models");
module.exports = {
  findOne: function(req, res) {
    db.Comment
      .findOne(req.query)
      .then(function(dbComment) {
        res.json(dbComment);
    });
  },
  create: function(req, res) {
    db.Comment
      .create(req.body)
      .then(function(dbComment) {
        res.json(dbComment);
    });
  },
  delete: function(req, res) {
    db.Comment
      .remove({ _id: req.params.id })
      .then(function(dbComment) {
        res.json(dbComment);
    });
  }
};