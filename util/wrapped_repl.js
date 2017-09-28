"use strict";

const repl = require("repl");
const net = require("net");
const { PassThrough } = require("stream");

module.exports = class WrappedRepl {
    constructor(output_handler, options) {
        console.log("repl process created")
        this._input_interface = new PassThrough();
        this._output_interface = new PassThrough();

        this._output_interface.on('data', output_handler)

        this._server = repl.start(Object.assign({
            input : this._input_interface,
            output : this._output_interface
        }, options))
    }

    write(input) {
        this._input_interface.write(input);
    }

    on(event, callback) {
        this._server.on(event, callback);
    }
}