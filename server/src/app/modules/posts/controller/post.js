const _ = require('lodash');
const Post = require('../../models/Post');
const defaultSort = {_id: -1};

const skip = (page = 1, limit = 10) => {
    return (page - 1) * limit;
};

const sort = (sortField, sortOrder) => {
    if (_.isEmpty(sortField)) {
        return defaultSort;
    }
    const sortBy = {};
    sortBy[sortField] = sortOrder;
    return sortBy;
};

const find = (fields) => {
    const search = {};
    if (fields && fields.name) {
        const name = fields.name;
        return {name: {'$regex': name}};
    }
    return search;
};

const List = ({options}) => {
    return new Promise((resolve, reject) => {
        const query = Object.assign({}, options.query);
        console.log(query, options, Object.assign({}, options.query));
        Post.find(find(query))
            .limit(10)
            .skip(skip(query.page, 10))
            .sort(sort(query.sortField, query.sortOrder))
            .exec(function(err, users) {
                if (err) {
                    return resolve({code: 400, message: 'Error occurred while querying the database'});
                }

                const ResultsCount = new Promise((resolve, reject) => {
                    Post.find(find(query))
                        .exec((error, result) => {
                            if (error) {
                                reject(error);
                            }
                            resolve(result.length);
                        });
                });

                ResultsCount.then((count) => {
                    return resolve({code: 200, success: true, data: users, total: count});
                });
            });
    });
};

const View = ({options}) => {
    return new Promise((resolve, reject) => {
        try {
            const {params} = options;
            Post.find({id: params.id}, (error, doc) => {
                if (error) {
                    return reject({code: 400, error, message: 'Invalid params'});
                }
                return resolve({code: 200, data: doc[0]});
            });
        } catch (e) {
            reject({message: 'File not found', e: e});
        }
    });
};

const Add = ({body}) => {
    return new Promise((resolve, reject) => {
        try {
            const {title, text, userId = 1111} = body;
            const post = new Post();
            post.id = Date.now();
            post.userId = userId;
            post.title = title;
            post.body = text;

            post.save(function(error) {
                if (error) {
                    console.log(error);
                    return reject({code: 400, message: 'Euexpected error occured'});
                }
                return resolve({code: 200, message: 'Post added'});
            });
        } catch (e) {
            console.log(e);
            reject({message: 'File not found', e: e});
        }
    });
};

const AddComment = ({options, body}) => {
    return new Promise((resolve, reject) => {
        try {
            const {params} = options;
            const {name, email, text} = body;
            Post.find({id: params.id}, (error, doc) => {
                if (error) {
                    return reject({code: 400, error, message: 'Invalid params'});
                }
                if (_.isEmpty(doc[0])) {
                    return reject({code: 400, error, message: 'Invalid params'});
                }
                const {comments = []} = doc[0];
                comments.push({
                    name: name,
                    email: email,
                    body: text,
                    id: Date.now()
                });
                Post.update({id: params.id}, {$set: {comments: comments}}, (error, doc) => {
                    if (error) {
                        return reject({code: 400, error, message: 'Invalid params'});
                    }
                    return resolve({code: 200, data: doc});
                });
            });
        } catch (e) {
            reject({message: 'File not found', e: e});
        }
    });
};

const GetComment = ({options}) => {
    return new Promise((resolve, reject) => {
        try {
            const {params, query} = options;
            const {page} = query;
            const $pipe = [];
            $pipe.push({$match: {id: parseInt(params.id)}});
            $pipe.push({$unwind: '$comments'});
            $pipe.push({$sort: {_id: 1}});
            $pipe.push({$skip: skip(page, 3)});
            $pipe.push({$limit: 3});
            Post.aggregate($pipe, (error, result) => {
                if (error) {
                    return reject({code: 400, error, message: 'Invalid params'});
                }
                return resolve({code: 200, data: result});
            });
        } catch (e) {
            reject({message: 'File not found', e: e});
        }
    });
};

module.exports = {
    List,
    View,
    Add,
    AddComment,
    GetComment
};
