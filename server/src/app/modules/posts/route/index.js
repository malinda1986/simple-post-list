const express = require('express');
const postController = require('../controller');
const router = express.Router();

function postRoutes(handler) {
    router.route('/posts')
        .get(handler(postController.List))
        .post(handler(postController.Add));
    router.route('/posts/:id')
        .get(handler(postController.View));
    router.route('/posts/:id/comment')
        .post(handler(postController.AddComment));
    router.route('/posts/:id/comment')
        .get(handler(postController.GetComment));
    return router;
}
module.exports = postRoutes;
