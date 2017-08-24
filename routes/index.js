const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

const userMiddleware = require('../middlewares/userMiddleware');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const storyController = require('../controllers/storyController');
const testController = require('../controllers/testController');
const pagesController = require('../controllers/pagesController');
// Controllers

// Index pages
router.get('/', storyController.getHotStories);
router.get('/hot', storyController.getHotStories);

// Daily top
router.get('/top', testController.test);

// Hall of Salt
router.get('/hallofsalt', testController.test);

// Register
router.get('/register', 
    userMiddleware.shouldNotBeLoggedIn,
    userController.registerForm);
router.post('/register',
    userMiddleware.validateRegister,
    catchErrors(userMiddleware.isUsernameExist),
    catchErrors(userMiddleware.isEmailExist),
    catchErrors(userController.register),
    authController.login
);

// Log in
router.get('/login', 
    userMiddleware.shouldNotBeLoggedIn,
    userController.loginForm);
router.post('/login', authController.login);

// Claiming new password
router.get('/reset', 
    userMiddleware.shouldNotBeLoggedIn,
    userController.forgotForm);
router.post('/reset', catchErrors(userController.forgot));

// Reset flow
router.get('/account/new-password/:token', catchErrors(userController.reset));
router.post('/account/new-password/:token',
    userMiddleware.confirmedPasswords,
    userMiddleware.validatePasswords,
    catchErrors(userController.setNewPassword));

// Logout
router.get('/logout', authController.logout);

// Shows the create story page
// TODO: Before showing the story form, check if the user is authenticated
router.get('/add', userMiddleware.isLoggedIn, storyController.addStory);
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

// FAQ
router.get('/faq', pagesController.faq);
// Contact
router.get('/contact', testController.test);
// Feature Request
router.get('/featurereq', testController.test);

module.exports = router;