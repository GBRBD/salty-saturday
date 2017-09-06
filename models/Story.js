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
}, {
        toJSON: { virtuals: true },
        toOjbect: { virtuals: true },
    });

function autopopulate(next) {
    this.populate('author');
    this.populate('comments');
    next();
}

/**
 * This populates the author field with the user schema. 
 * If you dump the store value in the 'getStoryById' controller method, you can see it.
 */
storySchema.pre('find', autopopulate);
// I dont know what this does
storySchema.pre('findOne', autopopulate);

// find comments where the stories _id property === comment story property
storySchema.virtual('comments', {
    ref: 'Comment', // what model to link?
    localField: '_id', // which field on the story?
    foreignField: 'story' // which field on the comment?
});

/**
 * Query for the all time saltiest stories a.k.a. the Hall of Salt
 */
storySchema.statics.getHallOfSalt = function () {
    return this.aggregate([
        // filter for only items that have 5 or more upvotes
        { $match: { 'upvotes.4': { $exists: true } } },
        {
            $addFields: {
                totalUpvotes: { $size: "$upvotes" }
            }
        },
        { $sort: { totalUpvotes: -1 } },
        // change limit here
        { $limit: 10 }
    ]);
};

const today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);

/**
 * Query for the weekly saltiest stories a.k.a. the Weekly Top
 */
storySchema.statics.getWeeklyTop = function () {
    return this.aggregate([
        // filter for only items that have 2 or more upvotes
        {
            $match: {
                'upvotes.4': { $exists: true },
                'created': { $gte: today }
            }
        },
        {
            $addFields: {
                totalUpvotes: { $size: "$upvotes" }
            }
        },
        { $sort: { totalUpvotes: -1 } },
        // change limit here
        { $limit: 100 }

    ]);
};

module.exports = mongoose.model('Story', storySchema);
