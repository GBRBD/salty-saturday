const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

/**
 * Login page
 */
exports.loginForm = (req, res) => {
    res.render('auth/login', { title: 'Login' });
};

/**
 * Register page 
 */
exports.registerForm = (req, res) => {
    res.render('auth/register', { title: 'Register' });
};

/**
 * Do registration
 */
exports.register = async (req, res, next) => {
    const user = new User({ username: req.body.username, email: req.body.email });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next(); // pass to authController.login
};