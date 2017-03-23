'use strict';

const Command = require("./command");

const MESSAGE_PROCESS_CHUNK = 50;
const MESSAGE_PROCESS_MAX = 250;

class Purge extends Command {
    _initArgParams() {
        const meArgIndex = this.args.indexOf("--me");
        if (meArgIndex > -1) {
            this.me = true;
            this.args.splice(meArgIndex, 1);
        } else {
            this.me = false;
        }
    }

    constructor(args, event, client) {
        super(args, event, client);

        this._initArgParams();
    }

    _shoudDelete(message) {
        if (this.me) {
            return message.author.id === this.discordieClient.User.id;
        }
        return true;
    }

    _purgeMessages(channel, delete_limit, before, _processed) {
        const processed = _processed || 0;

        if (delete_limit <= 0 || processed >= MESSAGE_PROCESS_MAX) {
            return Promise.resolve();
        }

        return channel.fetchMessages(MESSAGE_PROCESS_CHUNK, before)
            .then(({ messages, limit, before, after }) => {
                let deleted_count = 0;
                for (let i in messages) {
                    const message = messages[i];

                    if (this._shoudDelete(message)) {
                        message.delete();
                        deleted_count++;
                    }

                    if (deleted_count === delete_limit) {
                        break;
                    }
                }

                if (deleted_count < delete_limit) {
                    const oldestMessage = messages[messages.length - 1];
                    return this._purgeMessages(channel, delete_limit - deleted_count, oldestMessage.id, processed + MESSAGE_PROCESS_CHUNK);
                }
                return;
            });
    }

    run() {
        const args = this.args.slice();
        const targetChannel = this.event.message.channel;
        const limit = args.shift() | 0;

        if (limit > 101) {
            return Promise.resolve();
        }

        return this._purgeMessages(this.event.message.channel, limit, this.event.message.id);
    }
}

module.exports = Purge;