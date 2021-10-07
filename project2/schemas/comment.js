const mongoose = require('mongoose');

const { Schema } = mongoose;
const commentSchema = new Schema({
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  commentTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('comment', commentSchema);
