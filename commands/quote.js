'use strict';

const Command = require("./command");

function getMessage(channel, messageId) {
    return channel.fetchMessages(1, messageId)
        .then(({ messages }) => channel.fetchMessages(1, undefined, messages[0].id))
        .then(({ messages }) => messages[0])
        .catch(() => {
            return channel.fetchMessages(1, undefined, messageId)
                .then(({ messages }) => channel.fetchMessages(1, messages[0].id))
                .then(({ messages }) => {
                    if (messages.length === 0) {
                        return Promise.reject("Message does not exist.");
                    }
                    return messages[0];
                })
        });
}

class QuoteCommand extends Command {
    constructor(args, event, client) {
        super(args, event, client);

        const unprocessedArgs = args.slice();

        if (unprocessedArgs[0] == "-c" || unprocessedArgs[0] == "-channel") {
            unprocessedArgs.shift();
            this.quoteSourceChannel = client.Channels.get(unprocessedArgs.shift());
        } else {
            this.quoteSourceChannel = this.event.message.channel;
        }

        this.targetMessageId = args.shift() || NaN;
    }

    run() {
        if (this.quoteSourceChannel === null) {
            return Promise.reject("Unknown channel specified.");
        }

        return getMessage(this.quoteSourceChannel, this.targetMessageId)
            .then(quotedMessage => {
                const quoteColor = 0x9eff98;

                const messagedGuild = this.quoteSourceChannel.guild;
                const author = messagedGuild.members.find(m => m.id === quotedMessage.author.id) || "unknown"

                const quoteHeader = `:pen_ballpoint: Quote from ${author.name}`;

                return this.event.message.channel.sendMessage("", false, {
                    color: quoteColor,
                    fields: [{
                        name: quoteHeader,
                        value: quotedMessage.content
                    }],
                    footer: { text: ` ~ said at ${new Date(quotedMessage.timestamp)}` }
                })
            });
    }
}

module.exports = QuoteCommand;