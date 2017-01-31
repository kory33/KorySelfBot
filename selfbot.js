const FS = require("fs");
const Discordie = require("discordie");
const Events = Discordie.Events;
const CommandProcessor = require("./command_processor.js");

const token = require("./.user_token.json");
const settings = require("./settings.json");
const client = new Discordie();

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    const message = e.message.content;
    if(message.startsWith(settings.prefix)){
        const processor = new CommandProcessor(e);
        const command = message.slice(settings.prefix.length);
        processor.process(command);
    }
});

client.connect(token);