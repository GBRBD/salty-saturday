/**
 * Inner API-s
 */
const mongoose = require('mongoose');

const EventEmitter = require('events').EventEmitter
const messageBus = new EventEmitter()

messageBus.setMaxListeners(1000)

const Story = mongoose.model('Story');
const Comment = mongoose.model('Comment');

exports.poll = (req, res) => {
    messageBus.once('message', (data) => {
        res.json({ comment: data })
    })
}

exports.heartbeat = (req, res) => {
    messageBus.emit('message', req.body)
    res.sendStatus(200)
}

exports.getComments = async (req, res) => {

    const find = { story: req.params.id };

    if (req.params.update) {
        find.created = {
            $gt: req.params.update
        }
    }

    const comments = await Comment
        .find(find)
        .sort({ created: 'desc' });

    res.json({ comments });

};

exports.addComment = async (req, res) => {

    if (req.body.text.trim().length == 0) return;

    const comment = {
        user: req.user._id,
        story: req.params.id,
        text: req.body.text
    };

    const newComment = new Comment(comment);
    await newComment.save()

    messageBus.emit('message', newComment)

    res.sendStatus(200)

};
