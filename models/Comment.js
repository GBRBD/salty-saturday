const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const commentSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an user!'
  },
  story: {
    type: mongoose.Schema.ObjectId,
    ref: 'Story',
    required: 'You must supply a story!'
  },
  text: {
    type: String,
    required: 'Your comment must have text!'
  }
});

function autopopulate(next) {
  this.populate('user');
  next();
}

commentSchema.pre('find', autopopulate);
commentSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('comment', commentSchema);
