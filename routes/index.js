const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errorHandlers');

// Middlewares

const userMiddleware = require('../middlewares/userMiddleware');
const pictureMiddleware = require('../middlewares/pictureMiddleware');
// Controllers

const apiController = require('../controllers/apiController');
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

// Weekly top
router.get('/top', storyController.getWeeklyTop);

// Hall of Salt
router.get('/hallofsalt', storyController.getHallOfSalt);

// Show an actual story
router.get('/reee/:id', catchErrors(storyController.getStoryById));

// User profile with the user's stories
router.get('/u/:usernameSlug', catchErrors(userController.userOverview));

// User's posts
router.get('/u/:usernameSlug/reees', catchErrors(userController.userPosts));

// User's upvotes
router.get('/u/:usernameSlug/upvotes', catchErrors(userController.userUpvotes));

// User's comments
//router.get('/u/:usernameSlug/comments', catchErrors(userController.userComments));

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

// Profile picture upload
router.post('/settings/profilepic', 
    pictureMiddleware.upload,
    catchErrors(pictureMiddleware.resize),
    catchErrors(userController.uploadProfilePicture)
);
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

// Delete a story
router.get('/stories/:id/delete', catchErrors(storyController.deleteStory));


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

// Upvote API
router.post('/api/stories/:id/upvote',
    userMiddleware.isLoggedIn,
    catchErrors(apiController.upvoteStory));

router.get('/api/stories/:id/getcomments/:update?', catchErrors(apiController.getComments))
router.post('/api/stories/:id/addcomment',
    userMiddleware.isLoggedIn,
    catchErrors(apiController.addComment));

router.get('/api/stories/polling/:id', apiController.poll);
router.post('/api/stories/polling/:id/heartbeat', apiController.heartbeat);

module.exports = router;
