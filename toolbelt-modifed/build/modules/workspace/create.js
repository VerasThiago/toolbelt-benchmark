"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const errors_1 = require("../../errors");
const Builder_1 = require("../../lib/clients/IOClients/apps/Builder");
const Workspaces_1 = require("../../lib/clients/IOClients/infra/Workspaces");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const edition_1 = require("./common/edition");
const VALID_WORKSPACE = /^[a-z][a-z0-9]{0,126}[a-z0-9]$/;
const promptWorkspaceCreation = (name) => {
    console.log(chalk_1.default.blue('!'), `Workspace ${chalk_1.default.green(name)} doesn't exist`);
    return prompts_1.promptConfirm('Do you wish to create it?');
};
const warmUpRouteMap = async (workspace) => {
    try {
        const builder = Builder_1.Builder.createClient({ workspace });
        await builder.availability('vtex.builder-hub@0.x', null);
        logger_1.default.debug('Warmed up route map');
    }
    catch (err) { } // eslint-disable-line no-empty
};
const promptWorkspaceProductionFlag = () => prompts_1.promptConfirm('Should the workspace be in production mode?', false);
const maybeLogWorkspaceAlreadyExists = (targetWorkspace, logIfAlreadyExists) => {
    if (!logIfAlreadyExists) {
        return;
    }
    logger_1.default.error(`Workspace '${targetWorkspace}' already exists.`);
};
exports.handleErrorCreatingWorkspace = (targetWorkspace, err) => {
    logger_1.default.error(`Failed to create workspace '${targetWorkspace}': ${err.message}`);
    const rep = ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({ originalError: err });
    if (rep.shouldRemoteReport) {
        logger_1.default.error(`ErrorID: ${rep.metadata.errorId}`);
    }
};
exports.workspaceExists = async (account, workspace, workspacesClient) => {
    var _a;
    try {
        await workspacesClient.get(account, workspace);
        return true;
    }
    catch (err) {
        if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            return false;
        }
        throw err;
    }
};
exports.workspaceCreator = async ({ targetWorkspace, clientContext, productionWorkspace, promptCreation, logIfAlreadyExists = true, }) => {
    var _a;
    if (!VALID_WORKSPACE.test(targetWorkspace)) {
        throw new errors_1.CommandError("Whoops! That's not a valid workspace name. Please use only lowercase letters and numbers.");
    }
    const { account, workspace, token } = clientContext !== null && clientContext !== void 0 ? clientContext : SessionManager_1.SessionManager.getSingleton();
    const workspaces = Workspaces_1.createWorkspacesClient({ workspace, account, authToken: token });
    if (await exports.workspaceExists(account, targetWorkspace, workspaces)) {
        maybeLogWorkspaceAlreadyExists(targetWorkspace, logIfAlreadyExists);
        return 'exists';
    }
    if (promptCreation && !(await promptWorkspaceCreation(targetWorkspace))) {
        return 'cancelled';
    }
    if (productionWorkspace == null) {
        productionWorkspace = await promptWorkspaceProductionFlag();
    }
    logger_1.default.debug('Creating workspace', targetWorkspace);
    try {
        await workspaces.create(account, targetWorkspace, productionWorkspace);
        logger_1.default.info(`Workspace ${chalk_1.default.green(targetWorkspace)} created ${chalk_1.default.green('successfully')} with ${chalk_1.default.green(`production=${productionWorkspace}`)}`);
        await edition_1.ensureValidEdition(targetWorkspace);
        // First request on a brand new workspace takes very long because of route map generation, so we warm it up.
        warmUpRouteMap(targetWorkspace);
        return 'created';
    }
    catch (err) {
        if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.data.code) === 'WorkspaceAlreadyExists') {
            maybeLogWorkspaceAlreadyExists(targetWorkspace, logIfAlreadyExists);
            return;
        }
        throw err;
    }
};
