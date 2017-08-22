const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const {catchErrors} = require('../handlers/errorHandlers');

// Controllers

// Create or edit a story
// TODO: Before showing the story form, check if the user is authenticated
router.get('/add', storyController.addStory);
router.post('/add', catchErrors(storyController.createStory));

module.exports = router;