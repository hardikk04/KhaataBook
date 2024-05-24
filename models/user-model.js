const mongoose = require("mongoose");

const userModle = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dp: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  hisaab: {
    type: Array,
  },
});

module.exports = mongoose.model("user", userModle);
