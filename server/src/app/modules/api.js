const express = require('express');
const swaggerUi = require('swagger-ui-express');

const spaceXHandler = require('./spacex');
const api = require('../api');
const config = require('../config');

const swaggerDocument = require('../doc/api.json');

const {app_path} = config.get('api');

const apiRoutes = function(middleware) {
    try {
        const router = express.Router();
        const {api: {cors}} = middleware;
        // enable CORS
        router.use(cors());
        router.use(`${app_path}/`, spaceXHandler.routes(api.http));

        router.use(`${app_path}/apidoc`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        return router;
    } catch (e) {
        console.log(e);
    }
};

module.exports = apiRoutes;
