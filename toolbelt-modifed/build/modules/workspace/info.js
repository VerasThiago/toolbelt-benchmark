"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const Workspaces_1 = require("../../lib/clients/IOClients/infra/Workspaces");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const { get } = Workspaces_1.createWorkspacesClient();
const pretty = p => (p ? chalk_1.default.green('true') : chalk_1.default.red('false'));
exports.default = async () => {
    const { account, workspace: currentWorkspace } = SessionManager_1.SessionManager.getSingleton();
    const meta = await get(account, currentWorkspace);
    const weight = currentWorkspace === 'master' ? 100 : meta.weight;
    return logger_1.default.info(`Workspace: name=${chalk_1.default.green(currentWorkspace)} production=${pretty(meta.production)} weight=${weight}`);
};
