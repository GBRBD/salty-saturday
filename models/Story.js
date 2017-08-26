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
    },
    upvotes: [
        { type: mongoose.Schema.ObjectId, ref: 'User' }
    ]
    // TODO: Max Lenght Validation
});

function autopopulate(next) {
    this.populate('author');
    next();
}

/**
 * This populates the author field with the user schema. 
 * If you dump the store value in the 'getStoryById' controller method, you can see it.
 */
storySchema.pre('find', autopopulate);
// I dont know what this does
storySchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Story', storySchema);