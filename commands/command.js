'use strict';

class Command {
    constructor(args, event) {
        this.args = args;
        this.event = event;
    }

    run() {
        throw new Error("Method not implemented.");
    }
}

module.exports = Command;