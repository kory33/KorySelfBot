'use strict';

const Command = require("./command.js");

class Topic extends Command {
    run() {
        const message = this.event.message.channel.topic || "*`No topic set to the channel`*";
        return this.event.message.channel.sendMessage(message);
    }
}

module.exports = Topic;