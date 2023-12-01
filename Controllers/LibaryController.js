const express = require("express");
const AppError = require("../utilities/ErrorHandler");
const AsyncError = require("../utilities/AsyncError");
const Story = require("../Models/storyModel");
const Libary = require("../Models/libaryModel");

const createLibary = AsyncError(async (req, res, next) => {
  if (await Libary.findOne({ user: req.user })) {
    return next(new AppError("You can't have more than one libary"));
  }

  const libary = await Libary.create({
    user: req.user.id,
  });

  res.json({ sucess: true, messaage: "Libary created", libary });
});

const addBooktoLibary = AsyncError(async (req, res, next) => {
  const libary = await Libary.findOne({ user: req.user });
  const { story } = req.body;

  const check = await libary.books.includes(story);
  if (check) {
    return next(new AppError("Story already added to Libary"));
  }
  libary.books.push(story);
  await libary.save();

  res.json({ sucess: true, messaage: "Book added to libary", libary });
});

const removeBookfromLibary = AsyncError(async (req, res, next) => {
  const libary = await Libary.findOne({ user: req.user });
  const { story } = req.body;

  const check = await libary.books.includes(story);
  if (!check) {
    return next(new AppError("This story does not exist in the libary"));
  }
  libary.books.pop(story);
  await libary.save();

  res.json({ sucess: true, messaage: "Book removed from libary", libary });
});

module.exports = {
  createLibary,
  addBooktoLibary,
  removeBookfromLibary,
};
