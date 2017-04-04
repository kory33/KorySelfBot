const PurgeModeEnum = {
    INVALID: -1,
    ALL_MESSAGES: 0,
    SELF_MESSAGES: 1,
}

const resolver = modeStr => {
    if (typeof modeStr !== "string") {
        return PurgeModeEnum.INVALID;
    }

    switch (modeStr.toLowerCase()) {
        case "all":
            return PurgeModeEnum.ALL_MESSAGES;
        case "me":
            return PurgeModeEnum.SELF_MESSAGES;
        default:
            return PurgeModeEnum.INVALID;
    }
}

module.exports = PurgeModeEnum;
module.exports.resolve = resolver;