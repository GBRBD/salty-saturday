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
  res.redirect(`/`,{story});
};