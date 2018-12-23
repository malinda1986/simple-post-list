const express = require('express');
const postHandler = require('./posts');
const api = require('../api');
const config = require('../config');

const {app_path} = config.get('api');

const apiRoutes = function(middleware) {
    try {
        const router = express.Router();
        const {api: {cors}} = middleware;
        // enable CORS
        router.use(cors());
        router.use(`${app_path}/`, postHandler.routes(api.http));

        return router;
    } catch (e) {
        console.log(e);
    }
};

module.exports = apiRoutes;
