'use strict';

const Command = require("./command");
const PurgeModeEnum = require("./purge/purge_mode_enum")

const MESSAGE_PROCESS_CHUNK = 50;
const MESSAGE_PROCESS_MAX = 250;

class Purge extends Command {
    constructor(args, event, client) {
        super(args, event, client);

        const unprocessedArgs = this.args.slice();

        const modeOptionStr = unprocessedArgs.shift() || "";
        this.mode = PurgeModeEnum.resolve(modeOptionStr);
        this.limit = (unprocessedArgs.shift() | 0) || 0;
    }

    _shoudDelete(message) {
        if (this.mode === PurgeModeEnum.ALL_MESSAGES) {
            return true;
        }

        if (this.mode === PurgeModeEnum.SELF_MESSAGES) {
            return message.author.id === this.discordieClient.User.id;
        }

        return false;
    }

    _purgeMessages(channel, deleteMessageNum, before, _processed) {
        const processed = _processed || 0;

        if (deleteMessageNum <= 0 || deleteMessageNum > 100) {
            return Promise.reject("The message deletion limit should be in the range of 1-100.");
        }

        if (processed >= MESSAGE_PROCESS_MAX) {
            return Promise.reject(`Failed to delete ${deleteMessageNum - processed} messages(reached the end of the search range).`);
        }

        const fetchAmount = Math.min(MESSAGE_PROCESS_CHUNK, MESSAGE_PROCESS_MAX - processed);

        return channel.fetchMessages(fetchAmount, before)
            .then(({ messages, limit, before, after }) => {
                const deleteCandidateMessages = [];
                for (const message of messages) {
                    if (this._shoudDelete(message)) {
                        deleteCandidateMessages.push(message);
                    }
                }

                const deleteTargetMessages = deleteCandidateMessages.slice(0, deleteMessageNum);

                for (const message of deleteTargetMessages) {
                    message.delete();
                }

                const deletedCount = deleteTargetMessages.length;

                if (deletedCount === deleteMessageNum) {
                    return Promise.resolve();
                }

                if (messages.length < fetchAmount) {
                    return Promise.reject(`Reached the beginning of the channel.`);
                }

                return this._purgeMessages(channel, deleteMessageNum - deletedCount, after, processed + fetchAmount);
            });
    }

    run() {
        if (this.mode === PurgeModeEnum.INVALID) {
            return Promise.reject(`Mode option should be all|me, but given ${this.args.join(" ")}`);
        }

        if (this.limit > 101) {
            return Promise.reject("Delete limit cannot be more than 100.");
        }

        return this._purgeMessages(this.event.message.channel, this.limit, this.event.message.id);
    }
}

module.exports = Purge;