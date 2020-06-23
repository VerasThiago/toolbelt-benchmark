"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const Sponsor_1 = require("../../lib/clients/IOClients/apps/Sponsor");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
exports.default = async () => {
    const sponsorClient = Sponsor_1.Sponsor.createClient();
    const data = await sponsorClient.getEdition();
    logger_1.default.info(`Current edition for account ${chalk_1.default.blue(SessionManager_1.SessionManager.getSingleton().account)} is ${chalk_1.default.green(data.id)}`);
};
