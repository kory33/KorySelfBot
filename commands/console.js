"use strict";

const WrappedRepl = require("../util/wrapped_repl");
const Command = require("./command");

class ConsoleManager {
    constructor() {
        this._consoles = {
            central : undefined,
            binds : {}
        }
        this._central_console_target = {sendMessage : () => null};

        this.resetCentral();
    }

    resetCentral() {
        if (this._consoles.central) {
            this._consoles.central.exit();
        }
        this._consoles.central = this._getConsoleProcess(data => this._central_console_target.sendMessage(data));
    }

    unbind(id) {
        const target = this._consoles.binds[id];
        if (target) {
            target.exit();
        }
        this._consoles.binds[id] = undefined;
    }

    bind(id, output_handler) {
        this.unbind(id);
        const bound_process = this._getConsoleProcess(output_handler);
        this._consoles.binds[id] = bound_process;

        bound_process.on('exit', () => this.unbind(id));
        return bound_process;
    }

    getBinds() {
        return this._consoles.binds;
    }

    executeScript(channel, script) {
        this._central_console_target = channel;
        const target_console = this._consoles.binds[channel.id] || this._consoles.central;

        target_console.write(script + "\n");
    }

    _getConsoleProcess(output_handler) {
        return new WrappedRepl(output_handler, { prompt : "" });
    }
}

const modeMethodNames = {
    "list" : "_list",
    "bind" : "_bind",
    "exec" : '_exec'
}

const singletonManager = new ConsoleManager();

class ConsoleCommand extends Command {
    constructor(...args) {
        super(...args);
        this.target_channel = this.event.message.channel;
    }

    _list() {
        const binds = singletonManager.getBinds();
        const message = Object.keys(binds)
            .map(id => [id, binds[id]])
            .map(([id, process]) => process ? `<#${id}>` : "")
            .filter(x => x !== "")
            .join("\n") || "```No console bound.```";

        return this.target_channel.sendMessage(message);
    }

    _bind() {
        singletonManager.bind(this.target_channel.id, data => this.target_channel.sendMessage(data));

        const message = `\`\`\`REPL server bound to channel <#${this.target_channel.id}>\`\`\``;
        return this.target_channel.sendMessage(message);
    }

    _exec(script) {
        singletonManager.executeScript(this.target_channel, script.join(" "));

        return Promise.resolve();
    }

    run() {
        const args_copy = this.args.slice();

        const mode = args_copy.shift();
        const remaining_args = args_copy.slice();

        const exec_method = modeMethodNames[mode];

        if (!exec_method) {
            return this.event.message.channel
                .sendMessage(`\`\`\`Mode is undefined\`\`\``)
                .then(sent_message => new Promise(res => setTimeout(res, 2000, sent_message)))
                .then(sent_message => sent_message.delete());
        }

        return this[exec_method](remaining_args);
    }
}

module.exports = ConsoleCommand;