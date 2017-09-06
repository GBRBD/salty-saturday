const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slugs');
mongoose.Promise = global.Promise;

const passportLocalMongoose = require('passport-local-mongoose');

/**
 * User schema
 */
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Please supply a username',
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: 'Please Supply an email address'
    },
    slug: String,
    photo: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.pre('save', async function (next) {

    this.slug = slug(this.username);

    next();
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });

module.exports = mongoose.model('User', userSchema);
