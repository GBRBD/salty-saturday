const passport = require('passport');
const mongoose = require('mongoose');
const promisify = require('es6-promisify');

const User = mongoose.model('User');

/**
 * Log in the user
 */
exports.login = passport.authenticate('local', {
    failureRedirect: 'back',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});


/**
 * Log out the user
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};
