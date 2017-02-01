module.exports = {
    process: (args, channel) => {
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

            return "*Evaluation result:* `" + result + "`";
        } catch (error) {
            return "*Error occured!*```CSS\n" + error.toString() + "```";
        }
    }
}