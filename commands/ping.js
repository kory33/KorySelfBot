'use strict';

const Command = require("./command.js");

class Ping extends Command {
    run() {
        const sentTime = new Date();
        return this.event.message.channel.sendMessage("Ping!").then(sentMessage => {
            const timeDiff = (new Date()) - sentTime;
            sentMessage.edit(sentMessage.content + " *=> response time: `" + timeDiff + " ms`*");
        });
    }
}

module.exports = Ping;