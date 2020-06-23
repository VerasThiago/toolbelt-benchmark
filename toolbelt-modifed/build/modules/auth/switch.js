"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = require("ramda");
const errors_1 = require("../../errors");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const create_1 = require("../workspace/create");
const welcome_1 = tslib_1.__importDefault(require("./welcome"));
const checkAndSwitch = async (targetAccount, targetWorkspace) => {
    const session = SessionManager_1.SessionManager.getSingleton();
    const { account: currAccount } = session;
    const isValidAccount = /^\s*[\w-]+\s*$/.test(targetAccount);
    if (!isValidAccount) {
        throw new errors_1.CommandError('Invalid account format');
    }
    else if (!currAccount) {
        throw new errors_1.CommandError("You're not logged in right now");
    }
    else if (currAccount === targetAccount) {
        throw new errors_1.CommandError(`You're already using the account ${chalk_1.default.blue(targetAccount)}`);
    }
    await session.login(targetAccount, {
        targetWorkspace,
        workspaceCreation: {
            promptCreation: true,
            creator: create_1.workspaceCreator,
            onError: create_1.handleErrorCreatingWorkspace,
        },
    });
    const { account, workspace, userLogged } = session;
    logger_1.default.info(`Logged into ${chalk_1.default.blue(account)} as ${chalk_1.default.green(userLogged)} at workspace ${chalk_1.default.green(workspace)}`);
};
exports.switchAccount = async (account, options) => {
    const { account: currAccount, lastUsedAccount } = SessionManager_1.SessionManager.getSingleton();
    if (options.gracefulAccountCheck && currAccount === account) {
        return false;
    }
    if (options.initialPrompt) {
        const confirm = await prompts_1.promptConfirm(options.initialPrompt.message);
        if (!confirm) {
            return false;
        }
    }
    if (account === '-') {
        account = lastUsedAccount;
        if (account == null) {
            throw new errors_1.CommandError('No last used account was found');
        }
    }
    const previousAccount = currAccount;
    // Enable users to type `vtex switch {account}/{workspace}` and switch
    // directly to a workspace without typing the `-w` option.
    const [parsedAccount, parsedWorkspace] = ramda_1.split('/', account);
    if (parsedWorkspace) {
        options = { ...options, workspace: parsedWorkspace };
    }
    await checkAndSwitch(parsedAccount, options.workspace || 'master');
    logger_1.default.info(`Switched from ${chalk_1.default.blue(previousAccount)} to ${chalk_1.default.blue(parsedAccount)}`);
    if (options.showWelcomeMessage) {
        await welcome_1.default();
    }
    return true;
};
function returnToPreviousAccount({ previousAccount, previousWorkspace, promptConfirmation = true, }) {
    return exports.switchAccount(previousAccount, {
        workspace: previousWorkspace,
        gracefulAccountCheck: true,
        showWelcomeMessage: false,
        ...(promptConfirmation
            ? {
                initialPrompt: {
                    message: `Now you are logged in ${chalk_1.default.blue(SessionManager_1.SessionManager.getSingleton().account)}. Do you want to return to ${chalk_1.default.blue(previousAccount)} account?`,
                },
            }
            : null),
    });
}
exports.returnToPreviousAccount = returnToPreviousAccount;
