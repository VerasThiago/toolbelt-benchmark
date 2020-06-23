"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
exports.default = () => {
    logger_1.default.debug('Clearing config file');
    const sessionManager = SessionManager_1.SessionManager.getSingleton();
    sessionManager.logout();
    logger_1.default.info('See you soon!');
};
