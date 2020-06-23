"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = require("ramda");
const Workspaces_1 = require("../../lib/clients/IOClients/infra/Workspaces");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const use_1 = tslib_1.__importDefault(require("./use"));
const promptWorkspaceDeletion = (names) => prompts_1.promptConfirm(`Are you sure you want to delete workspace${names.length > 1 ? 's' : ''} ${chalk_1.default.green(names.join(', '))}?`, true);
exports.deleteWorkspaces = async (workspacesClient, account, names = []) => {
    const name = ramda_1.head(names);
    const decNames = ramda_1.tail(names);
    if (names.length === 0) {
        return [];
    }
    logger_1.default.debug('Starting to delete workspace', name);
    try {
        await workspacesClient.delete(account, name);
        logger_1.default.info(`Workspace ${chalk_1.default.green(name)} deleted ${chalk_1.default.green('successfully')}`);
        return ramda_1.flatten([name, await exports.deleteWorkspaces(workspacesClient, account, decNames)]);
    }
    catch (err) {
        logger_1.default.warn(`Workspace ${chalk_1.default.green(name)} was ${chalk_1.default.red('not')} deleted`);
        logger_1.default.error(`Error ${err.response.status}: ${err.response.statusText}. ${err.response.data.message}`);
        return exports.deleteWorkspaces(workspacesClient, account, decNames);
    }
};
exports.default = async (names, options) => {
    const preConfirm = options.y || options.yes;
    const force = options.f || options.force;
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    logger_1.default.debug(`Deleting workspace${names.length > 1 ? 's' : ''}:`, names.join(', '));
    if (!force && ramda_1.contains(workspace, names)) {
        return logger_1.default.error(`You are currently using the workspace ${chalk_1.default.green(workspace)}, please change your workspace before deleting`);
    }
    if (!preConfirm && !(await promptWorkspaceDeletion(names))) {
        return;
    }
    const workspacesClient = Workspaces_1.createWorkspacesClient();
    const deleted = await exports.deleteWorkspaces(workspacesClient, account, names);
    if (ramda_1.contains(workspace, deleted)) {
        logger_1.default.warn(`The workspace you were using was deleted`);
        return use_1.default('master');
    }
};
