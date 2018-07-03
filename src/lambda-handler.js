'use strict';

const TrelloTodo = require('./TrelloTodo');

module.exports.run = async (event, context, callback) => {
    const trelloTodo = new TrelloTodo();
    await trelloTodo.run();

    callback(null, 'All good!');
};