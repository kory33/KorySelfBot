module.exports = {
    reflect: message => {
        const timeDiff = (new Date()) - message.createdAt;
        message.edit(message.content + " response time: " + timeDiff + " ms");
        return null;
    }
}