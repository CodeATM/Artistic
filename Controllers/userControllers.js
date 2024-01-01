const express = require("express");
const AppError = require("../utilities/ErrorHandler");
const AsyncError = require("../utilities/AsyncError");
const User = require("../Models/userModel");
const uploadToCloudinary = require('../utilities/cloudinaryConfig')

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
    // const user = req.user.id
    const user = await User.findById(req.user.id)
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    if (!req.file.path) {
        return next(new AppError("No file uploaded", 404));
    }

    const imagePath = req.file.path;

    const image = await uploadToCloudinary(imagePath)

    console.log(image)
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id, // use req.user.id directly
        { $set: { profileImage: image } },
        { new: true }
    );
    res.json({ sucess: true, messaage: "Image uploaded",updatedUser});
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
