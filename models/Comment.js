var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var commentSchema = new Schema({
  _headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
  },
  date: {
    type: Date,
    default: Date.now
  },
  commentText: String
});
var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
