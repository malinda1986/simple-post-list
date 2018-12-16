const request = require('request');
const qs = require('qs');
const config = require('../../../config');
const {host} = config.get('spaceXAPI');

const getURI = (uri, query) => {
    return `${uri}?${qs.stringify(query)}`;
};

const UpcommingLunches = (query) => {
    return new Promise((resolve, reject) => {
        request(getURI(`${host}launches/upcoming`, query), function(error, response, body) {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(body));
        });
    });
};

const PastLunches = (query) => {
    return new Promise((resolve, reject) => {
        request(getURI(`${host}launches`, query), function(error, response, body) {
            if (error) {
                return reject(error);
            }
            return resolve(JSON.parse(body));
        });
    });
};

const Search = ({options}) => {
    return new Promise((resolve, reject) => {
        try {
            const {query} = options;
            const actionType = query.type;
            delete query.type;
            if (actionType === 'upcoming') {
                return resolve(UpcommingLunches(query));
            } else if (actionType === 'launches') {
                return resolve(PastLunches(query));
            }
            return reject({code: 400, message: 'Invalid params'});
        } catch (e) {
            reject({message: 'File not found', e: e});
        }
    });
};

module.exports = {
    Search
};
