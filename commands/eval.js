'use strict';

module.exports = {
    process: (args, event) => {
        // raw output
        const rawOutput = (args[0] == "--raw") || (args[0] == "-r");
        if(rawOutput) {
            args.shift();
        }

        const evalString = args.join(" ");

        try{
            const result = eval(evalString);

            if(rawOutput) {
                return result;
            }

            return ":desktop: *Evaluation result:*```" + result + "```";
        } catch (error) {
            return "*Error occured!*```CSS\n" + error.toString() + "```";
        }
    }
}