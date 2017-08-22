const mongoose = require('mongoose');
const Story = mongoose.model('Story');

// Renders the 'editStory.pug' which shows the '_storyForm.pug'
exports.addStory = (req, res) => {
  res.render('editStory', { title: 'Add Story' });
};

// Create a new story
exports.createStory = async (req, res) => {
  const story = await (new Story(req.body)).save();
  req.flash('success', `Successfully Created.`);
  // TODO: Redirect to the created story
  res.redirect(`/story/${story._id}`);
};

// Get every story and show them on the '/stories'
exports.getStories = async (req, res) => {
  const stories = await Story.find();
  res.render('stories', { title: 'Salty Stories', stories });
};

// Return a story by the given id
exports.getStoryById = async (req, res) => {
  const story = await Story.findById({ _id: req.params.id });
  res.render('story', { title: story.title, story });
};

exports.editStory = async (req, res) => {
  // 1. Find the story by given the ID
  const story = await Story.findOne({ _id: req.params.id });
  // 2. confirm they are the owner of the story
  // TODO
  // 3. Render out the edit form so the user can update their story
  res.render('editStory', { title: `Edit ${story.name}`, story });
};

exports.updateStory = async (req, res) => {
  // Find and update the story
  const story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new story instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${story.title}</strong>. <a href="/story/${story._id}">View Story </a>`);
  res.redirect(`/stories/${story._id}/edit`);
  // Redriect to the story and tell it worked
};