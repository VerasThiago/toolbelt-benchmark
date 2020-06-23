"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const errors_1 = require("../../errors");
const Workspaces_1 = require("../../lib/clients/IOClients/infra/Workspaces");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const use_1 = tslib_1.__importDefault(require("./use"));
const { promote, get } = Workspaces_1.createWorkspacesClient();
const { account, workspace: currentWorkspace } = SessionManager_1.SessionManager.getSingleton();
const throwIfIsMaster = (workspace) => {
    if (workspace === 'master') {
        throw new errors_1.CommandError(`It is not possible to promote workspace ${workspace} to master`);
    }
};
const isPromotable = async (workspace) => {
    throwIfIsMaster(workspace);
    const meta = await get(account, currentWorkspace);
    if (!meta.production) {
        throw new errors_1.CommandError(`Workspace ${chalk_1.default.green(currentWorkspace)} is not a ${chalk_1.default.green('production')} workspace\nOnly production workspaces may be promoted\nUse the command ${chalk_1.default.blue('vtex workspace create <workspace> --production')} to create a production workspace`);
    }
};
const promptPromoteConfirm = (workspace) => prompts_1.promptConfirm(`Are you sure you want to promote workspace ${chalk_1.default.green(workspace)} to master?`, true);
exports.default = async () => {
    logger_1.default.debug('Promoting workspace', currentWorkspace);
    await isPromotable(currentWorkspace);
    const promptAnswer = await promptPromoteConfirm(currentWorkspace);
    if (!promptAnswer) {
        return;
    }
    await promote(account, currentWorkspace);
    logger_1.default.info(`Workspace ${chalk_1.default.green(currentWorkspace)} promoted successfully`);
    await use_1.default('master');
};
