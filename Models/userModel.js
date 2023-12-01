const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please add your name"],
  },
  penname: {
    type: String,
    minlength: 6,
    unique: [true, "Name already used"],
    required: [true, 'Please add a unique Penname']
  },
  bio: {
    type: String,
    maxlength: [100, "Bio must not be more than 100 words including spacinng"],
  },
  email: {
    type: String,
    required: [true, "Please enter Email"],
    unique: [true, "Email has been registered Before"],
    validate: [validator.isEmail, "please add a valid Email "],
  },
  
  password: {
    //Add a regex to make the password a conbination of characters alpbabeths and symbols
    type: String,
    required: [true, "Please enter password"],
    select: false,
  },

  confirmPassword: {
    type: String,
    required: [true, "Please confirrm the password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and confirm password are not the same",
    },
  },
  isWriter: {
    type: Boolean,
    default: false,
  },
  profileImage: String,

  //reset password
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// hashing and comparing password using jwt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//reset Password token

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const timeZoneOffsetInMilliseconds = new Date().getTimezoneOffset() * 60000;
  const expirationTime =
    Date.now() + 10 * 60 * 1000 - timeZoneOffsetInMilliseconds;
  this.passwordResetExpires = new Date(expirationTime);
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
