const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * Auth middleware
 */

/**
 * Check is user logged in
 */

function checkAuth(req) {
  return req.isAuthenticated();
}

exports.isLoggedIn = (req, res, next) => {
  if (checkAuth(req)) {
    return next()
  }
  req.flash('error', 'Oops you must be logged in to do that!');
  res.redirect('/login');
};

exports.shouldNotBeLoggedIn = (req, res, next) => {
  if (checkAuth(req)) {
    res.redirect('/');
  }
  return next();
}

/**
 * Register password confirmation 
 */
exports.confirmedPasswords = (req, res, next) => {
  
  if (req.body.password === req.body['password-confirm']) {
    return next();
  }
  
  req.flash('error', 'Passwords do not match!');
  res.redirect('back');

};

/**
 * Password validator
 */
exports.validatePasswords = (req, res, next) => {
  
  req.checkBody('password', 'You must supply a password between 6 and 18 characters!').isLength({ min: 6, max: 18 });
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);
  
  const errors = req.validationErrors();
  
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.redirect('back');
    return;
  }

  return next();

}

/**
 * Register form validation
 */
exports.validateRegister = (req, res, next) => {

  req.sanitizeBody('name');
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });

  req.checkBody('username', 'You must supply a username between 4 and 12 characters!').isLength({ min: 4, max: 12 });
  req.checkBody('email', 'That email is not valid!').isEmail();
  req.checkBody('password', 'You must supply a password between 6 and 18 characters!').isLength({ min: 6, max: 18 });
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('auth/register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }

  return next(); // there were no errors!

};

/**
 * Is username already exist?
 */
exports.isUsernameExist = async (req, res, next) => {

  const user = await User.findOne({ username: req.body.username });

  if (user) {
    req.flash('error', 'This username is already taken!');
    res.render('auth/register', { title: 'Register', body: req.body, flashes: req.flash() });
  }

  return next();

}

/**
 * Is email already exist?
 */
exports.isEmailExist = async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (user) {
    req.flash('error', "This email address is already taken!");
    res.render('auth/register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }

  return next();

}
