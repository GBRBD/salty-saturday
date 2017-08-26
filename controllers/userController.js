const mongoose = require('mongoose');
const User = mongoose.model('User');
const Story = mongoose.model('Story');

const promisify = require('es6-promisify');
const crypto = require('crypto');
const mail = require('../handlers/mail');

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
    console.log(user);
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next(); // pass to authController.login
};

/**
 * Password reset page
 */
exports.forgotForm = (req, res) => {
    res.render('auth/reset', { title: 'New password' });
};


/**
 * Send password reset email
 */
exports.forgot = async (req, res) => {
    // 1. See if a user with that email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'No account with that email exists.');
        return res.redirect('/reset');
    }
    // 2. Set reset tokens and expiry on their account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    // 3. Send them an email with the token
    const resetURL = `http://${req.headers.host}/account/new-password/${user.resetPasswordToken}`;
    await mail.send({
        user,
        filename: 'password-reset',
        subject: 'Password Reset',
        resetURL
    });
    req.flash('success', `You have been emailed a password reset link.`);
    // 4. redirect to login page
    res.redirect('/login');
};

/**
 * Password reset form
 */
exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login');
    }
    // if there is a user, show the rest password form
    res.render('auth/new-password', { title: 'Reset your Password' });
};

/**
 * Set user's new password
 */
exports.setNewPassword = async (req, res) => {

    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login');
    }

    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    const updatedUser = await user.save();
    await req.login(updatedUser);

    req.flash('success', 'Your password has been reset! You are now logged in!');
    res.redirect('/');

};

exports.settings = async (req, res) => {
    const user = await User.findOne({ _id: req.user.id });
    res.render('profile/settings', { title: 'Settings' });
};

exports.saveEmail = async (req, res) => {

    const updates = {
        email: req.body.email
    };

    // I don't have the mood for this shit
    // TODO: refact the mongoose error
    const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: updates },
        { new: true, runValidators: true, context: 'query' },
        (dbResponse) => {
            if (dbResponse && dbResponse.code == 11000) {
                req.flash('success', 'This email address is already taken!');
                res.redirect('back');             
            } else {
                req.flash('success', 'Updated the email!');
                res.redirect('back');
            }
        }
    );

};

exports.saveNewPassword = async (req, res) => {

    const user = await User.findOne({ _id: req.user.id })

    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);

    const updatedUser = await user.save();
    await req.login(updatedUser);

    req.flash('success', 'Updated the password!');
    res.redirect('settings');

};

/**
 * User profile overview
 */
exports.userOverview = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username: username });
    res.render('profile/profile', { title: `${user.username}'s salt`, user });
};

/**
 * User profile, with the user's posts
 */
exports.userPosts = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username: username });
    const stories = await Story.find({ author: user._id });
    res.render('stories/stories', { title: `${user.username}'s salt`, stories });
};

/**
 * User upvotes
 */
exports.userUpvotes = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username: username });
    const stories = await Story.find({ upvotes: user._id });
    res.render('stories/stories', { title: `${user.username}'s upvotes`, stories });
};

