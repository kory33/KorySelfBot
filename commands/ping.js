'use strict';

const MessageCommand = require("./message_command.js");

class Ping extends MessageCommand {
    getResponse() {
        return "Ping!";
    }

    run() {
        const sentTime = new Date();
        return super.run().then(sentMessage => {
            const timeDiff = (new Date()) - sentTime;
            sentMessage.edit(sentMessage.content + " *=> response time: `" + timeDiff + " ms`*");
        });
    }
}

module.exports = Ping;