const express = require("express");
const AppError = require("../utilities/ErrorHandler");
const AsyncError = require("../utilities/AsyncError");
const Story = require("../Models/storyModel");
const Chapter = require("../Models/ChapterModel");
const Filtering = require("../utilities/Filtering");
const uploadToCloudinary = require('../utilities/cloudinaryConfig')

const getStories = AsyncError(async (req, res, next) => {
  const features = new Filtering(Story.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const stories = await features.query;

  res.json({ sucess: true, messaage: "Here are your stories", stories });
});

const getUserStories = AsyncError(async (req, res, next) => {

  const user = req.user;

  const story = await Story.find({ author: user });

  if (!story) {
    return next(new AppError("Story not found", 401));
  }

  res.json({ sucess: true, messaage: "Here is your story", story });
});

const getStory = AsyncError(async (req, res, next) => {
  const { storyID } = req.params;

  const story = await Story.findByIdAndUpdate(
    storyID,
    { $inc: { views: 1 } }, // Increment views by 1
    { new: true } // Get the updated tour document
  )
    .populate("chapters")
    .populate("author");

  if (!story) {
    return next(new AppError("Story not found", 401));
  }

  res.json({ sucess: true, messaage: "Here is your story", story });
});

const createStory = AsyncError(async (req, res, next) => {
  if (req.user.isWriter == false) {
    return next(new AppError("This user is not a writer.Please update your profile to a writer's profile"));
  }
  const { title, category, description, age} = req.body;
  const imagePath = req.file.path;

  const image = await uploadToCloudinary(imagePath)


  const story = await Story.create({
    title,
    category,
    description,
    age,
    author: req.user.id,
    storyBanner:image
  });
  res.json({ sucess: true, messaage: "Story created successfuly", story});
});

const editStory = AsyncError(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (story.author.toString() === req.user.id.toString()) {
    const updatedstory = await Story.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedstory);
  } else {
    return next(new AppError("you cannot update this story"));
  }
});

const deleteStory = AsyncError(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError("This story doesn't Exist", 404));
  } else if (story.author.toString() !== req.user.id.toString()) {
    return next(new AppError("You are not authorized to do this", 404));
  } else {
    await Story.findByIdAndDelete(story);
    return res
      .status(200)
      .json({ success: true, message: "story Deleted successfully" });
  }
});

const reaction = AsyncError(async(req, res, next) => {
  const user = req.user
  const storyId = req.params.storyId

  const story = await Story.findOne({storyId})

  await story.like(user)
  res.json({ sucess: true, messaage: "liked",});
})



module.exports = {
  createStory,
  getStory,
  editStory,
  deleteStory,
  getStories,
  getUserStories,
reaction
};
