const PingCmd = require("./commands/ping.js");
const EvalCmd = require("./commands/eval.js");
const TopicCmd = require("./commands/topic.js");
const SetGameCmd = require("./commands/setgame.js");

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

    _getProcessorClass() {
        switch (this.commandName) {
            case "ping":
                return PingCmd;
            case "eval":
                return EvalCmd;
            case "topic":
                return TopicCmd;
            case "setgame":
                return SetGameCmd;
        }

        return null;
    }

    /**
     * return the string result of command evaluation
     */
    run() {
        if (this.commandName === undefined) {
            return null;
        }

        const CommandProcessorClass = this._getProcessorClass();

        if (CommandProcessorClass === null) {
            console.log(`command "${this.commandName}" was given but was ignored.`);
            return null;
        }

        this._processGlobalArg();

        return (new CommandProcessorClass(this.commandArgs, this.event, this.discordieClient)).run();
    }
}