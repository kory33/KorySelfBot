module.exports = {
    process: args => {
        const evalString = args.join(" ");
        return eval(evalString);
    }
}