'use strict';
const Command = require("./command");
const mjAPI = require("mathjax-node");
const gm = require("gm");
const stream = require("stream");
const svgexport = require('svgexport');

function getEquationSVGString(source) {
    return new Promise((resolve, reject) => {
        mjAPI.typeset({
            "math": source,
            "format": "TeX",
            "svg": true
        }, data => {
            if (data.errors) {
                reject(data.errors);
            }
            resolve(data.svg);
        });
    });
}

function getJpgFromSvg(svgSource) {
    const processedSource = `<?xml version="1.1" encoding="UTF-8" standalone="no"?>` + svgSource;
    return gm(Buffer.from(processedSource), "svg.svg").options({
            imageMagick: true
        })
        .setFormat("jpg")
        .stream();
}

class MathJaxCommand extends Command {
    run() {
        const source = this.args.join(" ");
        const channel = this.event.message.channel;
        return getEquationSVGString(source)
            .then(svgData => getJpgFromSvg(svgData))
            .then(jpgData => {
                return channel.uploadFile(jpgData, "equation.jpg", "", false);
            }).catch(e => {
                return Promise.reject(`Error while handing process with mathjax: ${e}`);
            });
    }
}

module.exports = MathJaxCommand