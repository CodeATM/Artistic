const express = require("express");
const router = express.Router();
const { VerifyUser } = require("../middlewares/getCurrentUser");
const { createLibary, addBooktoLibary, removeBookfromLibary } = require("../Controllers/LibaryController");

router.post("/createLibary", VerifyUser, createLibary);
router.post("/addBooktoLibary", VerifyUser, addBooktoLibary);
router.delete("/removeBookFromLibary", VerifyUser, removeBookfromLibary);

module.exports = router;
