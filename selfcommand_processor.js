const PingCmd = require("./commands/ping.js");

module.exports = class SelfCommandProcessor{
    constructor(event, commandPrefix) {
        this.event = event;
        this.rawMessage = event.message.content;

        if(!this.rawMessage.startsWith(commandPrefix)) {
            return;
        }

        this.command = this.rawMessage.slice(commandPrefix.length).split(" ");
    }

    /**
     * return the string result of command evaluation
     */
    process() {
        if(this.command === undefined || this.command.length == 0) {
            return;
        }

        const commandArgs = this.command.concat();
        const commandName = commandArgs.shift().toLowerCase();

        switch(commandName) {
            case "ping":
                return PingCmd.process(commandArgs);
            default:
                console.log(`command "${commandName}" was given but was ignored.`);
                return;
        }
    }

    feedBackOutput() {
        this.event.channel.sendMessage(this.process());
    }
}