const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * Auth middleware
 */

/**
 * Check is user logged in
 */
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error', 'Oops you must be logged in to do that!');
  res.redirect('/login');
};

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

  next(); // there were no errors!

};

/**
 * Is data already exist?
 */

exports.isUsernameExist = async (req, res, next) => {

  const user = await User.findOne({ username: req.body.username });

  if (user) {
    req.flash('error', 'This username is already taken!');
    res.render('auth/register', { title: 'Register', body: req.body, flashes: req.flash() });
  }

  next();

}

exports.isEmailExist = async (req, res, next) => {

  console.log(req.body.email);

  const user = await User.findOne({ email: req.body.email });

  if (user) {
    req.flash('error', "This email address is already taken!");
    res.render('auth/register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }

  next();

}
