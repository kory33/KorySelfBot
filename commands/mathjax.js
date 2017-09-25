'use strict';
const Command = require("./command");
const mjAPI = require("mathjax-node-svg2png");
const sharp = require("sharp");

function getEquationPNGFromSource(source) {
    return new Promise((resolve, reject) => {
        mjAPI.typeset({
            "math": source,
            "format": "TeX",
            "png": true,
            "scale":2
        }, data => {
            if (data.errors) {
                reject(data.errors);
            }
            resolve(data.png);
        });
    });
}

class MathJaxCommand extends Command {
    run() {
        const source = this.args.join(" ");

        if (source.replace(/^\s*|\s*$/g, "") === "") {
            return Promise.reject("Mathjax: arguments missing!");
        }

        const channel = this.event.message.channel;
        return Promise.all([
                channel.sendMessage(`\`\`\`Generating mathjax image with the given mathjax text: ${source}\`\`\``),
                getEquationPNGFromSource(source)
            ])
            .then(([generationMessage, pngImagePlain]) => {
                generationMessage.delete();
                return new Buffer(pngImagePlain.substring("data:image/png;base64,".length), "base64");
            })
            .then(pngBuffer => sharp(pngBuffer)
                .flatten()
                .background("#FFFFFF")
                .jpeg()
                .extend(10)
                .toBuffer({ resolveWithObject : true })
            )
            .then(({data : jpgBuffer}) => Promise.all([
                    channel.sendMessage(`\`\`\`Generated the image, uploading it...\`\`\``),
                    channel.uploadFile(jpgBuffer, "equation.jpg", "")
                ])
            )
            .then(([uploadingMessage]) => uploadingMessage.delete())
            .catch(error => Promise.reject(`Error while handing process with mathjax: ${error}`));
    }
}

module.exports = MathJaxCommand
