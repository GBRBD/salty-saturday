const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

const userMiddleware = require('../middlewares/userMiddleware');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const storyController = require('../controllers/storyController');

// Controllers

router.get('/', storyController.getStories);

// Auth
router.get('/register', userController.registerForm);
router.post('/register',
    userMiddleware.validateRegister,
    userMiddleware.isUsernameExist,
    userMiddleware.isEmailExist,
    userController.register,
    authController.login
);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

// Shows the create story page
// TODO: Before showing the story form, check if the user is authenticated
router.get('/add', authMiddleware.isLoggedIn, storyController.addStory);
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
