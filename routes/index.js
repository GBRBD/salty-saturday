const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');

const authMiddleware = require('../middlewares/authMiddleware');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const storyController = require('../controllers/storyController');

// Controllers

router.get('/', (req, res) => { res.send('home') });

// Auth
router.get('/register', userController.registerForm);
router.post('/register',
    authMiddleware.validateRegister,
    userController.register,
    authController.login
);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

// Create or edit a story
// TODO: Before showing the story form, check if the user is authenticated
router.get('/add', 
    authMiddleware.isLoggedIn,
    storyController.addStory);
router.post('/add', catchErrors(storyController.createStory));


module.exports = router;
