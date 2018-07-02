const needle = require('needle');
require('dotenv').config({ path: __dirname + '/.env' });

async function run() {
    const data = await needle('get', `https://api.trello.com/1/boards/${process.env.BOARD_ID}/cards?key=${process.env.API_KEY}&token=${process.env.API_TOKEN}`);
    const timeFrame = getTimeframe();

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
            await needle('put', `https://api.trello.com/1/cards/${card.id}?key=${process.env.API_KEY}&token=${process.env.API_TOKEN}`, {
                idList: process.env.SOON_LIST_ID
            });

        }

        console.log(); // Empty line for nice logs
    }
}


function getTimeframe() {
    // TODO cache this!
    const today = new Date();
    today.setDate(today.getDate() + parseInt(process.env.LOOKAHEAD));
    return today.getTime();
}

run();