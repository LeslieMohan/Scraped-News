var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Comment schema
var CommentSchema = new Schema({
    body: {
        type: String
    },
    body: {
        type: String,
        required: true
    }
});

// Create the Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;