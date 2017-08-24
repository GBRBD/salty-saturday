const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

/**
 * Story schema
 */
const storySchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'You must supply a title!'
    },
    story: {
        type: String,
        trim: true,
        required: 'You must supply a story!'
    },
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author!'
      }
    // TODO: Max Lenght Validation
});

module.exports = mongoose.model('Story', storySchema);