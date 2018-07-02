const needle = require('needle');
require('dotenv').config({ path: __dirname + '/.env' });

class TrelloTodo{

    constructor() {
        this.timeframeCache = null;
    }

    async run() {
        const data = await this._makeTrelloRequest('get', `boards/${process.env.BOARD_ID}/cards`, null);
        const timeFrame = this._getTimeframe();

        for (const card of data.body) {

            // Short circuit: we're not interested in cards that don't
            // have a due date or that aren't in the first column.
            if (!card.due || card.idList !== process.env.BACKLOG_LIST_ID) {
                continue;
            }

            const dueDate = new Date(card.due).getTime();
            console.log('Checking: ', card.name, card.due);

            if (dueDate >= Date.now() && dueDate <= timeFrame) {
                console.log('--> Almost due. Moving card..', card.due, card.name);

                await this._makeTrelloRequest('put', `cards/${card.id}`, {
                    idList: process.env.SOON_LIST_ID
                });
            }

            console.log(); // Empty line for nice logs
        }
    }

    _makeTrelloRequest(method, path, data) {
        return needle(method, `https://api.trello.com/1/${path}?key=${process.env.API_KEY}&token=${process.env.API_TOKEN}`, data);
    }

    _getTimeframe() {
        if (this.timeframeCache !== null) {
            return this.timeframeCache;
        }

        const today = new Date();
        today.setDate(today.getDate() + parseInt(process.env.LOOKAHEAD));

        this.timeframeCache = today.getTime();
        return this.timeframeCache;
    }

}

module.exports = TrelloTodo;