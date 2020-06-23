"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SessionManager_1 = require("../../lib/session/SessionManager");
const utils_1 = require("./utils");
exports.default = () => {
    const { account } = SessionManager_1.SessionManager.getSingleton();
    utils_1.copyToClipboard(account);
    return console.log(account);
};
