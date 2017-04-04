'use strict';

const Command = require("./command");

class DeleteAfterCommand extends Command {
    constructor(args, event, client) {
        super(args, event, client);

        const argsCopy = args.slice();

        this.deletionTime = (argsCopy.shift() | 0) || NaN;
        this.message = argsCopy.join(" ");
    }

    run() {
        if (this.deletionTime === NaN || this.deletionTime < 0) {
            return Promise.reject(`Invalid time span specified: ${this.deletionTime}`);
        }

        return this.event.message.channel.sendMessage(this.message || "\u200b")
            .then(message => {
                return new Promise(resolve => setTimeout(() => resolve(message), this.deletionTime))
            })
            .then(message => message.delete());
    }
}

module.exports = DeleteAfterCommand;