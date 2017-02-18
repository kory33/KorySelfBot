'use strict';

const MessageCommand = require("./message_command.js");

class SetGame extends MessageCommand {
    getResponse() {
        const commandArgs = this.args.slice();

        const gamename = commandArgs.join(" ");

        if (gamename === undefined) {
            return ```setgame failed!```;
        }

        this.discordieClient.User.setGame(gamename);
        
        return `\`\`\`Set the game to ${gamename}\`\`\``;
    }

    run() {
        return super.run().then(sentMessage => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    sentMessage.delete();
                    resolve();
                }, 2000);
            });
        });
    }
}

module.exports = SetGame;