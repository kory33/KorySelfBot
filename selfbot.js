const FS = require("fs");
const Discordie = require("discordie");
const Events = Discordie.Events;
const SelfCommandProcessor = require("./selfcommand_processor.js");

const token = require("./.user_token.json");
const settings = require("./settings.json");
const client = new Discordie();

let reconnectInterval = 1;

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    reconnectInterval = 1;

    console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    if (client.User.id !== e.message.author.id) {
        return;
    }
    (new SelfCommandProcessor(e, settings.prefix, client)).run();
});

client.Dispatcher.on(Discordie.Events.DISCONNECTED, e => {
    console.log(`Disconnected from Discord... Trying to reconnect in ${reconnectInterval} seconds`);

    const reconnectTime = reconnectInterval * 1000;
    reconnectInterval *= 2;

    return new Promise((resolve) => {
        setTimeout(() => {
            client.connect(settings);
            resolve();
        }, reconnectTime);
    });
});

client.connect(token);

process.on("beforeExit", () => client.connect(settings));