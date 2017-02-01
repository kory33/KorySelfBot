const PingCmd = require("./commands/ping.js");
const EvalCmd = require("./commands/eval.js");

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

    processGlobalArg() {
        if(this.commandArgs[0] === "-d" || this.commandArgs[0] === "--delete") {
            this.message.delete();
            this.commandArgs.shift();
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

        this.processGlobalArg();

        switch(this.commandName) {
            case "ping":
                return PingCmd.process(this.commandArgs);
            case "eval":
                return EvalCmd.process(this.commandArgs, this.message);
            default:
                console.log(`command "${this.commandName}" was given but was ignored.`);
                return null;
        }
    }

    feedBackOutput() {
        const output = this.process();
        if(output === null || output === "") {
            return;
        }
        this.event.message.channel.sendMessage(output);
    }
}