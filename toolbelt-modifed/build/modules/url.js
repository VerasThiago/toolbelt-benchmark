"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const SessionManager_1 = require("../lib/session/SessionManager");
exports.default = () => {
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    console.log(`https://${workspace}--${account}${env_1.clusterIdDomainInfix()}.${env_1.publicEndpoint()}`);
};
