'use strict';

const MessageCommand = require("./message_command.js");

class Topic extends MessageCommand {
    getResponse() {
        return this.event.message.channel.topic || "*`No topic set to the channel`*";
    }
}

module.exports = Topic;