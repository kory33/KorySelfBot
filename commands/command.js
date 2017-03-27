'use strict';

class Command {
    constructor(args, event, discordieClient) {
        this.args = args;
        this.event = event;
        this.discordieClient = discordieClient;
    }

    /**
     * Run the task represented by the command.
     * @returns the promise of the task to be carried out.
     */
    run() {
        throw new Error("Method not implemented.");
    }
}

module.exports = Command;