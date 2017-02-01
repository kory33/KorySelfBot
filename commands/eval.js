'use strict';

module.exports = {
    process: (args, event) => {
        // json format output
        const jsonOutput = (args[0] == "--json");
        if(jsonOutput) {
            args.shift();
        }

        // specification of highlight format
        let highlightFormat = "";
        if(jsonOutput) {
            highlightFormat = "JSON";
        } else if ((args[0] == "--highlight") || (args[0] == "-h")) {
            args.shift();
            highlightFormat = args.shift();
        }

        // raw output
        const rawOutput = (args[0] == "--raw") || (args[0] == "-r");
        if(rawOutput) {
            args.shift();
        }

        const evalString = args.join(" ");

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