const mongoose = require('mongoose');
const Story = mongoose.model('Story');

/**
 * Renders the 'editStory.pug' which shows the '_storyForm.pug'
 */
exports.addStory = (req, res) => {
  res.render('stories/editStory', { title: 'Add Story' });
};

/**
 * Create a new story
 */
exports.createStory = async (req, res) => {
  req.body.author = req.user._id;
  const story = await (new Story(req.body)).save();
  req.flash('success', `Successfully Created.`);
  // TODO: Redirect to the created story
  res.redirect(`/reee/${story._id}`);
};

/**
 * Get every story and show them on the '/stories', the last created store is the first in the page
 */
exports.getHotStories = async (req, res) => {
  const stories = await Story.find().sort({ created: -1 });
  res.render('stories/stories', { title: 'Salty Stories', stories });
};

/**
 * Return a story by the given id
 */
exports.getStoryById = async (req, res, next) => {
  const story = await Story.findById({ _id: req.params.id });
  if (!story) return next(); // !story = 404
  res.render('stories/story', { title: story.title, story });
};

/**
 * Renders the 'editStory.pug'
 */
exports.editStory = async (req, res) => {
  // 1. Find the story by given the ID
  const story = await Story.findOne({ _id: req.params.id });
  // 2. confirm they are the owner of the story, if not redirect back
  if (req.user === undefined || !story.author.equals(req.user._id)) {
    // TODO: This doesn't work, if you type the edit url to the browser it redirects you to the home page
    // req.flash('error', 'You are not the author of this story!');
    res.redirect('/');
    return;
  }
  // 3. Render out the edit form so the user can update their story
  res.render('stories/editStory', { title: `Edit ${story.name}`, story });
};

/**
 * Update a story
 */
exports.updateStory = async (req, res) => {
  // Find and update the story
  const story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new story instead of the old one
    runValidators: true
  }).exec();
  // Redriect to the story and tell it worked
  req.flash('success', 'You\'ve successfully updated your salty story!');
  res.redirect(`/reee/${story._id}`);
};

/**
 * Delete a story
 */
exports.deleteStory = async (req, res) => {
  // 1. Find the story by given the ID
  const story = await Story.findOne({ _id: req.params.id });

  if (req.user === undefined || !story.author.equals(req.user._id)) {
    // req.flash('error', 'You are not the author of this story!');
    res.redirect('/');
    return;
  }

  // Delete story
  await story.remove();

  // Redriect to the story and tell it worked
  req.flash('success', 'You\'ve successfully deleted your salty story!');
  res.redirect('/');
};

/**
 * Upvote a story
 */
exports.upvoteStory = async (req, res) => {
  // The user id type is ObjectId you need to convert it to string.
  const userId = req.user._id.toString();
  const story = await Story.findById({_id:req.params.id});
  const upvotes = story.upvotes.map(obj=>obj.toString());
  const operator = upvotes.includes(userId) ? '$pull' : '$addToSet';
  
  const upvote = await Story.
    findByIdAndUpdate(
      {_id: req.params.id}, 
      { [operator]: { upvotes: req.user._id}}, 
      {new: true} 
    );

  res.json(upvote);
};
