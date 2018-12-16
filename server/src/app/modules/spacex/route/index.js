const express = require('express');
const spaceXController = require('../controller');
const router = express.Router();

function spaceXRoutes(handler) {
    router.route('/search')
        .get(handler(spaceXController.Search));
    return router;
}
module.exports = spaceXRoutes;
