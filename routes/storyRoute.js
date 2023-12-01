const express = require('express')
const router = express.Router()
const {VerifyUser} = require('../middlewares/getCurrentUser')
// const { VerifyUser } = require("../middlewares/VerifyUser");
const {createStory, getStory, editStory, getStories, getUserStories, reaction, deleteStory} = require('../Controllers/storyController')
const { createChapter, getOneChapter, editChapter, deleteChapter } = require('../Controllers/ChapterController')

router.post('/createStory', VerifyUser,  createStory)
router.post('/addChapter/:storyID', VerifyUser,  createChapter)
router.post('/editChapter/:id', VerifyUser,  editChapter)
router.delete('/deleteChapter/:id', VerifyUser,  deleteChapter)
router.post('/likeStory/:storyID/likes', VerifyUser,  reaction)



router.get('/getmyStories', VerifyUser,  getUserStories)
router.get('/getStory/:storyID', VerifyUser,  getStory)
router.get('/getStories', VerifyUser,  getStories)
router.get('/getChapter/:chapterID', VerifyUser,  getOneChapter)


router.put('/editStory/:id', VerifyUser,  editStory)
router.delete('/deleteStory/:id', VerifyUser,  deleteStory)


module.exports = router 