module.exports = {
    process: (args, event) => {
        return event.message.channel.topic || "no topic set";
    }
}