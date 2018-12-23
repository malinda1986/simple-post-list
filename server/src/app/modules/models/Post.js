const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id: {type: Number, required: true, index: true},
    title: {
        type: String, required: true, index: true
    },
    userId: {type: Number, required: true, index: true},
    body: {type: String, required: true, index: true},
    comments: [],
});

const PostModal = mongoose.model('posts', postSchema);
module.exports = PostModal;
