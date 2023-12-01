const express = require("express");
const router = express.Router();
const { VerifyUser } = require("../middlewares/getCurrentUser");
const {createReview, getStoryReviews, deletereview, editReview} = require("../Controllers/ReviewController");

router.post("/createReview/:storyId", VerifyUser, createReview);
router.get("/getReviews/:storyId", VerifyUser, getStoryReviews);

router.put('/editReview/:id', VerifyUser,   editReview)
router.delete('/deleteReview/:id', VerifyUser, deletereview)

module.exports = router;
