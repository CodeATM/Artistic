const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  chapterNumber: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


module.exports = mongoose.model("Chapter", chapterSchema);