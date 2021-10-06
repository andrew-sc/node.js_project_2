const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  nickName: {
    type: String,
    required: true,
    unique: true,
  },
  pw: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('user', userSchema);
