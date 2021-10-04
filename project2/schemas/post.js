const mongoose = require("mongoose");

const { Schema } = mongoose;
const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  writer: {
      type: String,
      required: true
  },
  pw: {
    type: String,
    required: true
  },
  contents: {
    type: String,
    required: true
  },
  postTime: {
      type: String,
      required: true,
      unique: true
  }
});

module.exports = mongoose.model("post", postSchema);