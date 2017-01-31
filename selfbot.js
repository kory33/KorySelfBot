const FS = require("fs");
const Discordie = require("discordie");
const Events = Discordie.Events;

const SETTINGS_FILENAME = ".user_token.json";
const settings = JSON.parse(FS.readFileSync(SETTINGS_FILENAME, "utf-8"));

const client = new Discordie();

client.connect(settings);

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log("Connected as: " + client.User.username);
})

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    if(e.message.content == "ping"){
        console.log("pong!");
    }
})
