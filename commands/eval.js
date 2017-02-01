'use strict';

const MessageCommand = require("./message_command.js");

class Eval extends MessageCommand {
    getResponse() {
        const commandArgs = this.args.slice();

        // json format output
        const jsonOutput = (commandArgs[0] == "--json");
        if(jsonOutput) {
            commandArgs.shift();
        }

        // specification of highlight format
        let highlightFormat = "";
        if(jsonOutput) {
            highlightFormat = "JSON";
        } else if ((commandArgs[0] == "--highlight") || (commandArgs[0] == "-h")) {
            commandArgs.shift();
            highlightFormat = commandArgs.shift();
        }

        // raw output
        const rawOutput = (commandArgs[0] == "--raw") || (commandArgs[0] == "-r");
        if(rawOutput) {
            commandArgs.shift();
        }

        const evalString = commandArgs.join(" ");

        try{
            let result = eval(evalString);

            if(rawOutput) {
                return result;
            }

            if(jsonOutput) {
                result = JSON.stringify(result, null, 4);
            }

            if(highlightFormat !== "") {
                result = highlightFormat + "\n" + result;
            }

            return ":desktop: *Evaluation result:*```" + result + "```";
        } catch (error) {
            return "*Error occured!*```CSS\n" + error.toString() + "```";
        }
    }
}

module.exports = Eval;