module.exports = {
    process: (args, event) => {
        return event.message.channel.topic || "*`No topic set to the channel`*";
    }
}