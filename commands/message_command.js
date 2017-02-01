'use strict';

const Command = require("./command.js");

/**
 * (Abstract) Represents a command that sends back certain response against user input
 */
class MessageCommand extends Command {
    getResponse() {
        throw new Error("Method not implemented.");
    }

    run() {
        return this.event.message.channel.sendMessage(this.getResponse());
    }
}

module.exports = MessageCommand;