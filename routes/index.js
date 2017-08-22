const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { catchErrors } = require('../handlers/errorHandlers');

// Controllers

// Shows the create story page
// TODO: Before showing the story form, check if the user is authenticated
router.get('/add', storyController.addStory);
// Creates a new story
router.post('/add', catchErrors(storyController.createStory));
// We need to edit the story. See more at '_storyForm.pug' form action.
router.post('/add/:id', catchErrors(storyController.updateStory));

// Show an actual story
router.get('/story/:id', catchErrors(storyController.getStoryById));

// Shows every story
router.get('/stories', catchErrors(storyController.getStories));
// Render out the edit form so the user can update their story
router.get('/stories/:id/edit', storyController.editStory);

module.exports = router;