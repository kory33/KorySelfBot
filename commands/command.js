'use strict';

class Command {
    constructor(args, event, discordieClient) {
        this.args = args;
        this.event = event;
        this.discordieClient = discordieClient;
    }

    run() {
        throw new Error("Method not implemented.");
    }
}

module.exports = Command;