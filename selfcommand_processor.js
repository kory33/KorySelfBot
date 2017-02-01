const PingCmd = require("./commands/ping.js");
const EvalCmd = require("./commands/eval.js");
const TopicCmd = require("./commands/topic.js");

const PingTimer = require("./commands/ping/ping_timer.js");

module.exports = class SelfCommandProcessor{
    constructor(event, commandPrefix) {
        this.event = event;
        this.message = event.message;

        if(!this.message.content.startsWith(commandPrefix)) {
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
        if(this.commandArgs[0] === "-d" || this.commandArgs[0] === "--delete") {
            this.message.delete();
            this.commandArgs.shift();
        }
    }

    _getProcessorClass() {
        switch(this.commandName){
            case "ping":
                return PingCmd;
            case "eval":
                return EvalCmd;
            case "topic":
                return TopicCmd;
        }

        return null;
    }

    /**
     * return the string result of command evaluation
     */
    run() {
        if(this.commandName === undefined) {
            return null;
        }

        const CommandProcessorClass = this._getProcessorClass();

        if (CommandProcessorClass === null) {
            console.log(`command "${this.commandName}" was given but was ignored.`);
            return null;
        }

        this._processGlobalArg();

        return (new CommandProcessorClass(this.commandArgs, this.event)).run();
    }
}