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

    _getProcessor() {
        switch(this.commandName){
            case "ping":
                return PingCmd.process;
            case "eval":
                return EvalCmd.process;
            case "topic":
                return TopicCmd.process;
            default:
                console.log(`command "${this.commandName}" was given but was ignored.`);
                return null;
        }
    }

    /**
     * return the string result of command evaluation
     */
    process() {
        // special case for ping message
        if(this.message.content == PingCmd.process(null)) {
            return PingTimer.reflect(this.message);
        }

        if(this.commandName === undefined) {
            return null;
        }

        this._processGlobalArg();

        const processor = this._getProcessor();

        if (processor === null) {
            console.log(`command "${this.commandName}" was given but was ignored.`);
            return null;
        }

        return processor();
    }

    /**
     * send back the process result to the same channel where the message was posted
     */
    runCommand() {
        const output = this.process();
        if(output === null || output === "") {
            return;
        }
        this.event.message.channel.sendMessage(output);
    }
}