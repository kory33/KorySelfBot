'use strict';

const Commands = require("./commands");

module.exports = class SelfCommandProcessor {
    constructor(event, commandPrefix, discordieClient) {
        this.event = event;
        this.message = event.message;
        this.discordieClient = discordieClient;

        if (!this.message.content.startsWith(commandPrefix)) {
            return;
        }

        const command = this.message.content.slice(commandPrefix.length).split(" ");

        this.commandName = command.shift().toLowerCase();
        this.commandArgs = command.concat();
    }

    /**
     * pre process the global argument that is irrelevant to the command itself
     */
    _processGlobalArg() {
        if (this.commandArgs[0] === "-d" || this.commandArgs[0] === "--delete") {
            this.message.delete();
            this.commandArgs.shift();
        }
    }

    /**
     * return the process promise
     */
    run() {
        if (this.commandName === undefined) {
            return null;
        }

        const CommandProcessorClass = Commands[this.commandName];

        if (CommandProcessorClass === undefined) {
            console.log(`command "${this.commandName}" was given but was ignored.`);
            return null;
        }

        this._processGlobalArg();

        return new CommandProcessorClass(this.commandArgs, this.event, this.discordieClient)
            .run()
            .catch(error => {
                console.log(`\`\`\`${error}\`\`\``);
                this.event.message.channel.sendMessage(`\`\`\`${error}\`\`\``);
            });
    }
}