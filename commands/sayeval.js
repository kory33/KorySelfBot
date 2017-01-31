module.exports = {
    process: (args, channel) => {
        const evalString = args.join(" ");
        try{
            const result = eval(evalString);
            channel.sendMessage(result);
            return null;
        } catch (error) {
            return "*Error occured!*```CSS\n" + error.toString() + "```";
        }
    }
}