"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const edition_1 = require("./common/edition");
const Workspaces_1 = require("../../lib/clients/IOClients/infra/Workspaces");
const promptWorkspaceReset = (name, account) => prompts_1.promptConfirm(`Are you sure you want to reset workspace ${chalk_1.default.green(name)} on account ${chalk_1.default.blue(account)}?`);
exports.default = async (name, options) => {
    const session = SessionManager_1.SessionManager.getSingleton();
    const { account } = session;
    const workspace = name || session.workspace;
    const preConfirm = options.y || options.yes;
    const production = !!(options.p || options.production);
    logger_1.default.debug('Resetting workspace', workspace);
    let promptAnswer;
    if (!preConfirm) {
        promptAnswer = await promptWorkspaceReset(workspace, account);
    }
    if (promptAnswer) {
        try {
            logger_1.default.debug('Starting to reset workspace', workspace, 'with production =', production);
            const workspaces = Workspaces_1.createWorkspacesClient();
            await workspaces.reset(account, workspace, { production });
            logger_1.default.info(`Workspace ${chalk_1.default.green(workspace)} was reset ${chalk_1.default.green('successfully')} using ${chalk_1.default.green(`production=${production}`)}`);
            await edition_1.ensureValidEdition(workspace);
        }
        catch (err) {
            logger_1.default.warn(`Workspace ${chalk_1.default.green(workspace)} was ${chalk_1.default.red('not')} reset`);
            if (err.response) {
                const { status, statusText, data = { message: null } } = err.response;
                const message = data.message || data;
                logger_1.default.error(`Error ${status}: ${statusText}. ${message}`);
            }
            throw err;
        }
    }
};
