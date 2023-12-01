const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, 'please specify a caegory'],
    enum: {
      values: ["Romantic", "Horror", "Twist", "Kids", "war", "others"],
      message: "Category not available",
    },
  },
  age: {
    type: String,
    required: true,
    enum: {
      values: ["Kids", "13+", "16+", "18+"],
      message: "Please add an age wethin the range.",
    },
  },
  description: { 
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  views: {
    type: Number,
    default: 0, // Initialize views to 0
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  storyBanner: String,
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

storySchema.methods.like = async function (user) {
  if (!this.likes.includes(user)) {
    this.likes.push(user);
    await this.save();
  } else {
    this.likes.pull(user);
    await this.save();
  }

  return;
};


// virtually populate with user(priority)

storySchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'story',
  localField: '_id'
});

module.exports = mongoose.model("Story", storySchema);
