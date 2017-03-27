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
    return new Promise((resolve, reject) => {
        try {
            resolve(
                gm(Buffer.from(processedSource), "svg.svg").options({
                    imageMagick: true
                })
                .setFormat("jpg")
                .stream()
            );
        } catch (error) {
            reject(error);
        }
    });
}

class MathJaxCommand extends Command {
    run() {
        const source = this.args.join(" ");
        const channel = this.event.message.channel;
        return Promise.all([
                channel.sendMessage(`\`\`\`Mathjax: Generating mathjax image with the given mathjax text: ${source}\`\`\``),
                getEquationSVGString(source)
                .then(svg => getJpgFromSvg(svg))
            ])
            .then(([genMessage, jpgImageData]) => Promise.all([
                genMessage.delete(),
                channel.sendMessage(`\`\`\`Generated the image, uploading it...\`\`\``),
                channel.uploadFile(jpgImageData, "equation.jpg", "")
            ]))
            .then(([, uploadingMessage]) => uploadingMessage.delete())
            .catch(e => {
                return Promise.reject(`Error while handing process with mathjax: ${e}`);
            });
    }
}

module.exports = MathJaxCommand