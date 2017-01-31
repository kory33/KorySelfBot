const PingCmd = require("./commands/ping.js");
const PingTimer = require("./commands/ping/ping_timer.js");

module.exports = class SelfCommandProcessor{
    constructor(event, commandPrefix) {
        this.event = event;
        this.message = event.message;

        if(!this.message.content.startsWith(commandPrefix)) {
            return;
        }
        
        this.command = this.message.content.slice(commandPrefix.length).split(" ");
    }

    /**
     * return the string result of command evaluation
     */
    process() {
        // special case for ping message
        if(this.message.content == PingCmd.process(null)) {
            return PingTimer.reflect(this.message);
        }

        if(this.command === undefined || this.command.length == 0) {
            return null;
        }

        const commandArgs = this.command.concat();
        const commandName = commandArgs.shift().toLowerCase();

        switch(commandName) {
            case "ping":
                return PingCmd.process(commandArgs);
            default:
                console.log(`command "${commandName}" was given but was ignored.`);
                return null;
        }
    }

    feedBackOutput() {
        const output = this.process();
        if(output === null) {
            return;
        }
        this.event.message.channel.sendMessage(this.process());
    }
}