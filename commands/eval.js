module.exports = {
    process: args => {
        const evalString = args.join(" ");
        try{
            const result = eval(evalString);
            return "*Evaluation result:* `" + result + "`";
        } catch (error) {
            return "*Error occured!*```CSS\n" + error.toString() + "```";
        }
    }
}