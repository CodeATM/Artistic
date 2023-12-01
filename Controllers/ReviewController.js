const express = require("express");
const AppError = require("../utilities/ErrorHandler");
const AsyncError = require("../utilities/AsyncError");
const Story = require("../Models/storyModel");
const Review = require("../Models/reviewModel");

//create a review
const createReview = AsyncError(async (req, res, next) => {
  const { storyId } = req.params;
  const { review, rating } = req.body;

  // console.log(id);

  const newReview = await Review.create({
    review,
    rating,
    story: storyId,
    user: req.user.id,
  });
  res.json({ sucess: true, messaage: "You have added a review", newReview });
});

// get all review pertaining to one story

const getStoryReviews = AsyncError(async (req, res, next) => {
  const { storyId } = req.params;

  const reviews = await Review.find({ story: storyId }).populate('story');

  res.json({ sucess: true, messaage: "Here are your reviews", reviews });
});

// edit review
const editReview = AsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (review && review.user.toString() == req.user.toString()) {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedReview);
  } else {
    return next(new AppError("not found or you are not authorized to do this"));
  }
});

//delete review
const deletereview = AsyncError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("This story doesn't Exist", 404));
  } else if (
    review.user.toString() !== req.user.id.toString()
  ) {
    return next(new AppError("You are not authorized to do this", 404));
  } else {
    await Story.findByIdAndDelete(req.user.id);
    return res
      .status(200)
      .json({ success: true, message: "story Deleted successfully" });
  }
});

module.exports = { createReview, getStoryReviews, deletereview, editReview };
