"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const toolbelt_message_renderer_1 = require("@vtex/toolbelt-message-renderer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const enquirer_1 = tslib_1.__importDefault(require("enquirer"));
const ToolbeltConfig_1 = require("../../lib/clients/IOClients/apps/ToolbeltConfig");
const ErrorKinds_1 = require("../../lib/error/ErrorKinds");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const create_1 = require("../workspace/create");
const welcome_1 = tslib_1.__importDefault(require("./welcome"));
const promptUsePreviousLogin = (account, userLogged, workspace) => {
    const details = `${chalk_1.default.green(userLogged)} @ ${chalk_1.default.green(account)} / ${chalk_1.default.green(workspace)}`;
    return prompts_1.promptConfirm(`Do you want to use the previous login details? (${details})`);
};
const promptUsePreviousAccount = (previousAccount) => {
    return prompts_1.promptConfirm(`Use previous account? (${chalk_1.default.blue(previousAccount)})`);
};
const promptDesiredAccount = async () => {
    const { account } = await enquirer_1.default.prompt({
        type: 'input',
        result: s => s.trim(),
        message: 'Account:',
        name: 'account',
        validate: s => /^\s*[\w-]+\s*$/.test(s) || 'Please enter a valid account.',
    });
    return account;
};
const notifyRelease = async () => {
    try {
        const messageRenderer = toolbelt_message_renderer_1.TemplateRenderer.getSingleton();
        const configClient = ToolbeltConfig_1.ToolbeltConfig.createClient();
        const { messages } = await configClient.getGlobalConfig();
        console.log(messageRenderer.renderNode(messages.releaseNotes));
    }
    catch (err) {
        ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
            kind: ErrorKinds_1.ErrorKinds.TOOLBELT_CONFIG_MESSAGES_ERROR,
            originalError: err,
        }).logErrorForUser({ coreLogLevelDefault: 'debug' });
    }
};
const getTargetLogin = async ({ account: optionAccount, workspace: optionWorkspace }) => {
    const { account: previousAccount, workspace: previousWorkspace, userLogged: previousUserLogged, } = SessionManager_1.SessionManager.getSingleton();
    const targetWorkspace = optionWorkspace || 'master';
    if (optionAccount) {
        return { targetAccount: optionAccount, targetWorkspace };
    }
    if (!previousAccount) {
        return { targetAccount: await promptDesiredAccount(), targetWorkspace };
    }
    if (previousWorkspace && !optionWorkspace) {
        if (await promptUsePreviousLogin(previousAccount, previousUserLogged, previousWorkspace)) {
            return { targetAccount: previousAccount, targetWorkspace: previousWorkspace };
        }
    }
    else if (await promptUsePreviousAccount(previousAccount)) {
        return { targetAccount: previousAccount, targetWorkspace };
    }
    return { targetAccount: await promptDesiredAccount(), targetWorkspace };
};
exports.default = async (opts) => {
    const { targetAccount, targetWorkspace } = await getTargetLogin(opts);
    const sessionManager = SessionManager_1.SessionManager.getSingleton();
    try {
        await sessionManager.login(targetAccount, {
            targetWorkspace,
            useCachedToken: false,
            workspaceCreation: {
                promptCreation: true,
                creator: create_1.workspaceCreator,
                onError: create_1.handleErrorCreatingWorkspace,
            },
        });
        logger_1.default.debug('Login successful', sessionManager.userLogged, targetAccount, sessionManager.token, targetWorkspace);
        logger_1.default.info(`Logged into ${chalk_1.default.blue(sessionManager.account)} as ${chalk_1.default.green(sessionManager.userLogged)} at workspace ${chalk_1.default.green(sessionManager.workspace)}`);
        await welcome_1.default();
        await notifyRelease();
    }
    catch (err) {
        if (err.statusCode === 404) {
            logger_1.default.error('Account/Workspace not found');
        }
        else {
            throw err;
        }
    }
};
