'use strict';
const Command = require("./command");

const RepeatStatusEnum = {
    INVALID: -1,
    START: 0,
    PAUSE: 1,
    RESUME: 2,
    STOP: 3
}

const statusResolver = modeStr => {
    if (typeof modeStr !== "string") {
        return RepeatStatusEnum.INVALID;
    }
    switch(modeStr.toLowerCase()) {
        case "start":
            return RepeatStatusEnum.START;
        case "pause":
            return RepeatStatusEnum.PAUSE;
        case "resume":
            return RepeatStatusEnum.RESUME;
        case "stop":
            return RepeatStatusEnum.STOP;
    }
    return RepeatStatusEnum.INVALID;
}

class RepeatTask {
    constructor(message, interval) {
        this.isActive = true;
        this.message = message;
        this.interval = interval;
    }
}

const repeatTaskStatusTable = {};

function registerRepeatTask(channel, task) {
    repeatTaskStatusTable[channel.id] = task;
}

function isTaskActive(channel) {
    const task = repeatTaskStatusTable[channel.id];
    return !!task && task.isActive;
}

function unregisterTask(channel) {
    registerRepeatTask(channel, null);
    return Promise.resolve();
}

function resumeTask(channel) {
    repeatTaskStatusTable[channel.id].isActive = true;
    return startSendingMessage(channel);
}

function pauseTask(channel) {
    repeatTaskStatusTable[channel.id].isActive = false;
    return Promise.resolve();
}

function startSendingMessage(channel) {
    const task = repeatTaskStatusTable[channel.id];
    if (!isTaskActive(channel)) {
        return Promise.resolve();
    }
    return channel
        .sendMessage(task.message)
        .then(_ => new Promise(res => setTimeout(() => res(), task.interval)))
        .then(_ => startSendingMessage(channel))
        .catch(err => {
            console.log(err);
            startSendingMessage(channel);
        });
}

class RepeatCommand extends Command {
    constructor(args, event, client) {
        super(args, event, client);

        const modeOptionStr = this.args.shift() || "";
        this.mode = statusResolver(modeOptionStr);
        this.channel = event.message.channel;
    }

    run() {
        if (this.mode == RepeatStatusEnum.INVALID) {
            return Promise.reject("Repeat status option should either be start, pause, resume, stop.");
        }
        if (this.mode == RepeatStatusEnum.START) {
            const unprocessedArgs = this.args.slice();
            const interval = (unprocessedArgs.shift() | 0) || 10000
            const message = unprocessedArgs.join(" ");

            const task = new RepeatTask(message, Math.max(1000, interval));
            registerRepeatTask(this.channel, task);
            return resumeTask(this.channel);
        } else if (this.mode == RepeatStatusEnum.PAUSE) {
            return pauseTask(this.channel);
        } else if (this.mode == RepeatStatusEnum.RESUME) {
            return resumeTask(this.channel);
        } else if (this.mode == RepeatStatusEnum.STOP) {
            return unregisterTask(this.channel);
        }

        return Promise.reject("Unhandled mode type");
    }
}

module.exports = RepeatCommand;
