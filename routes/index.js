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

/**
 * Stories
 */

// Index pages
router.get('/', storyController.getHotStories);
router.get('/hot', storyController.getHotStories);

// Daily top
router.get('/top', testController.test);

// Hall of Salt
router.get('/hallofsalt', testController.test);

// Show an actual story
router.get('/reee/:id', catchErrors(storyController.getStoryById));

// User profile with the user's stories
router.get('/p/:username', catchErrors(userController.userProfile));

/**
 * Auth
 */

// Register
router.get('/register',
    userMiddleware.shouldNotBeLoggedIn,
    userController.registerForm);

router.post('/register',
    userMiddleware.validateRegister,
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
    userMiddleware.validatePasswords,
    catchErrors(userController.setNewPassword));

// Logout
router.get('/logout', authController.logout);

/**
 * Account settings
 */
// Account edit
router.get('/settings', catchErrors(userController.settings));

router.post('/settings/email', userController.saveSettings);

router.post('/settings/password',
    userMiddleware.validatePasswords,
    catchErrors(userController.saveNewPassword));

/**
 * Story creating and editing
 */
router.get('/add', userMiddleware.isLoggedIn, storyController.addStory);
// Creates a new story
router.post('/add', catchErrors(storyController.createStory));
// We need to edit the story. See more at '_storyForm.pug' form action.
router.post('/add/:id', catchErrors(storyController.updateStory));

// Render out the edit form so the user can update their story
router.get('/stories/:id/edit', storyController.editStory);

/**
 * Pages
 */

// FAQ
router.get('/faq', pagesController.faq);
// Contact
router.get('/contact', testController.test);
// Feature Request
router.get('/featurereq', testController.test);

module.exports = router;