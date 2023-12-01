const express = require("express");
const AppError = require("../utilities/ErrorHandler");
const AsyncError = require("../utilities/AsyncError");
const Story = require("../Models/storyModel");
const Chapter = require("../Models/ChapterModel");

//-------------------------------------------------------------------------
// create new chapter
const createChapter = AsyncError(async (req, res, next) => {
  const { storyID } = req.params;

  const { chapterNumber, content, title } = req.body;

  const story = await Story.findById(storyID);

  if (!story) {
    return next(new AppError("Story not found", 401));
  }

  // if (req.user.id !== story.author) {
  //     return next(new AppError('You cant edit another person story', 401))
  // }

  const newChapter = await Chapter.create(req.body);
  story.chapters.push(newChapter._id);

  await story.save();
  res.json({ sucess: true, messaage: "New Chapter created successfuly" });
});

const getOneChapter = AsyncError(async (req, res, next) => {
  const { chapterID } = req.params;

  const chapter = await Chapter.findById(chapterID);

  if (!chapter) {
    return next(new AppError("Chapter not found", 401));
  }

  res.json({ sucess: true, messaage: "Here is your chapter", chapter });
});

const editChapter = AsyncError(async (req, res, next) => {
  
  const { id } = req.params;
  const chapter = await Chapter.findById(id);

  if (chapter) {
    const updatedchapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedchapter);
  } else {
    return next(new AppError("not found"));
  }
});

const deleteChapter = AsyncError(async (req, res, next) => {
  const chapter = await Chapter.findById(req.params.id);

  if (!chapter) {
    return next(new AppError("This chapter doesn't Exist", 404));
  } else {
    await Chapter.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "chapter Deleted successfully" });
  }
});

module.exports = {
  createChapter,
  getOneChapter,
  editChapter,
  deleteChapter,
};
