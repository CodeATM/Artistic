const express = require("express");
const AppError = require("../utilities/ErrorHandler");
const AsyncError = require("../utilities/AsyncError");
const User = require("../Models/userModel");


const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDDINARY_NAME ,
  api_key: process.env.CLOUDINARY_API-KEY,
  api_secret: process.env.CLOUDINARY_API-SECRET,
});


const getUser = AsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("user not found", 401))
      .populate("Libary")
      .populate("Story");
  }

  res.json({ sucess: true, messaage: "User Profile", user });
});

const updateProfilePhoto = AsyncError(async (req, res, next) => {
  const user = req.user.id
  const image = await cloudinary.uploader.upload(req.file.path)

  const updateUserPhoto = await User.findByIdAndUpdate(
    req.user.id, 
    {$set: req.body}
  )
  if (!updateUserPhoto) {
    return next(new AppError("Unable to change your photo now"));
  }
  res.json(updateUserPhoto);
});

const updateUserData = AsyncError(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: req.body },
    { new: true }
  );
  if (!updatedUser) {
    return next(new AppError("Unable to update user now"));
  }
  res.json(updatedUser);
});

module.exports = { getUser, updateUserData, updateProfilePhoto};
