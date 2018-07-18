const needle = require('needle');
require('dotenv').config({ path: __dirname + '/.env' });

class TrelloTodo{

    constructor() {
        this.timeframeCache = null;
    }

    async run() {
        const data = await this._makeTrelloRequest('get', `boards/${process.env.BOARD_ID}/cards`, null);
        const timeFrame = this._getTimeframe();
        const allowedListIds = [process.env.BACKLOG_LIST_ID, process.env.SOON_LIST_ID, process.env.MONTH_LIST_ID];

        for (const card of data.body) {

            // Short circuit: we're not interested in cards that don't
            // have a due date or that aren't in the allowedListIds
            // (Process cards in backlog & "soon" list)
            if (!card.due || allowedListIds.indexOf(card.idList) === -1) {
                continue;
            }

            const dueDate = new Date(card.due);
            const today = new Date();
            console.log('Checking: ', card.name, card.due, card.idList);

            // Check if the card is due today
            if (dueDate.getDate() === today.getDate() &&
                dueDate.getMonth() === today.getMonth() &&
                dueDate.getFullYear() === today.getFullYear()) {

                console.log('--> Due today! Moving card..', card.due, card.name);

                await this._moveCard(card, process.env.TODAY_LIST_ID);

                // Don't bother doing anything else with this card
                continue;
            }

            // Check if the card is due in the next 7 days
            if (dueDate.getTime() >= Date.now() && dueDate.getTime() <= timeFrame) {
                console.log('--> Almost due. Moving card..', card.due, card.name);

                await this._moveCard(card, process.env.SOON_LIST_ID);

                // Don't bother doing anything else with this card
                continue;
            }

            if(dueDate.getTime() >= Date.now() && dueDate.getTime() <= this._getTimeframeForDays(30)){
                console.log('--> Almost due (month). Moving card..', card.due, card.name);
                await this._moveCard(card, process.env.MONTH_LIST_ID);
                continue;
            }

            console.log(); // Empty line for nice logs
        }
    }

    _makeTrelloRequest(method, path, data) {
        return needle(method, `https://api.trello.com/1/${path}?key=${process.env.API_KEY}&token=${process.env.API_TOKEN}`, data);
    }

    _moveCard(cardObject, listId){
        return this._makeTrelloRequest('put', `cards/${cardObject.id}`, {
            idList: listId
        }); 
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

    _getTimeframeForDays(days){
        const today = new Date();
        today.setDate(today.getDate() + parseInt(days));

        return today.getTime();
    }

}

module.exports = TrelloTodo;