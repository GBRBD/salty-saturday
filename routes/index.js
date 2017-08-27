const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

// Middlewares

const userMiddleware = require('../middlewares/userMiddleware');

// Controllers

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const storyController = require('../controllers/storyController');
const testController = require('../controllers/testController');
const pagesController = require('../controllers/pagesController');

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
router.get('/u/:username', catchErrors(userController.userOverview));

// User's posts
router.get('/u/:username/reees',catchErrors(userController.userPosts));

// User's upvotes
router.get('/u/:username/upvotes', catchErrors(userController.userUpvotes));

// User's comments
router.get('/u/:username/comments', testController.test);

/**
 * Auth
 */

router.use('/register', userMiddleware.shouldNotBeLoggedIn);

// Register
router.get('/register', userController.registerForm);
router.post('/register',
    userMiddleware.validateRegister,
    userMiddleware.isUsernameExist,    
    userMiddleware.isEmailExist,
    catchErrors(userController.register),
    authController.login
);

router.use('/login', userMiddleware.shouldNotBeLoggedIn);
router.use('/reset', userMiddleware.shouldNotBeLoggedIn);

// Log in
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

// Claiming new password
router.get('/reset', userController.forgotForm);
router.post('/reset', catchErrors(userController.forgot));

// Reset flow
router.use('/account/new-password/:token', userMiddleware.shouldNotBeLoggedIn);
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
router.use('/settings', userMiddleware.isLoggedIn);
router.get('/settings', catchErrors(userController.settings));
router.post('/settings/email', catchErrors(userController.saveEmail));
router.post('/settings/password',
    userMiddleware.validatePasswords,
    catchErrors(userController.saveNewPassword));

/**
 * Story creating, editing and deleting
 */

router.use('/add', userMiddleware.isLoggedIn);

// Render out the add form
router.get('/add', storyController.addStory);

// Creates a new story
router.post('/add', catchErrors(storyController.createStory));

// We need to edit the story. See more at '_storyForm.pug' form action.
router.post('/add/:id', catchErrors(storyController.updateStory));

// Render out the edit form so the user can update their story
router.get('/stories/:id/edit', storyController.editStory);

// Render out the edit form so the user can update their story
router.post('/stories/:id/delete', catchErrors(storyController.deleteStory));


/**
 * Pages
 */

// FAQ
router.get('/faq', pagesController.faq);

// Contact
router.get('/contact', testController.test);

// Feature Request
router.get('/featurereq', testController.test);

/**
 * API
 */

router.use('/api/stories/:id/upvote', userMiddleware.isLoggedIn);

// Upvote API
router.post('/api/stories/:id/upvote', userMiddleware.isLoggedIn, catchErrors(storyController.upvoteStory));

module.exports = router;