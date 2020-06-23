"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const errors_1 = require("../../errors");
const Sponsor_1 = require("../../lib/clients/IOClients/apps/Sponsor");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const utils_1 = require("../apps/utils");
const switch_1 = require("../auth/switch");
const prompts_1 = require("../prompts");
const promptSwitchToAccount = async (account, initial) => {
    const reason = initial
        ? `Initial edition can only be set by ${chalk_1.default.blue(account)} account`
        : `Only current account sponsor (${chalk_1.default.blue(account)}) can change its edition`;
    const proceed = await prompts_1.promptConfirm(`${reason}. Do you want to switch to account ${chalk_1.default.blue(account)}?`);
    if (!proceed) {
        return;
    }
    await switch_1.switchAccount(account, {});
};
async function setEdition(edition, workspace, autoSwitchBack = false) {
    const session = SessionManager_1.SessionManager.getSingleton();
    const { account: previousAccount, workspace: previousWorkspace } = session;
    const targetAccount = session.account;
    const targetWorkspace = workspace !== null && workspace !== void 0 ? workspace : session.workspace;
    const workspaceNotice = targetWorkspace === 'master' ? '' : ` in workspace ${chalk_1.default.blue(targetWorkspace)}`;
    logger_1.default.info(`Changing edition of account ${chalk_1.default.blue(targetAccount)}${workspaceNotice}.`);
    const sponsorClient = Sponsor_1.Sponsor.createClient();
    const sponsorAccount = await sponsorClient.getSponsorAccount();
    if (!sponsorAccount) {
        if (targetWorkspace !== 'master') {
            throw new errors_1.CommandError('Can only set initial edition in master workspace');
        }
        await promptSwitchToAccount('vtex', true);
    }
    else {
        if (targetWorkspace === 'master') {
            await utils_1.promptWorkspaceMaster(targetWorkspace);
        }
        await promptSwitchToAccount(sponsorAccount, false);
    }
    try {
        const sponsorClientForSponsorAccount = Sponsor_1.Sponsor.createClient();
        await sponsorClientForSponsorAccount.setEdition(targetAccount, targetWorkspace, edition);
        logger_1.default.info(`Successfully changed edition${workspaceNotice} of account ${chalk_1.default.blue(targetAccount)}.`);
    }
    catch (ex) {
        logger_1.default.error(`Failed to change edition of account ${chalk_1.default.blue(targetAccount)}.`);
        throw ex;
    }
    finally {
        if (autoSwitchBack) {
            await switch_1.returnToPreviousAccount({ previousAccount, previousWorkspace, promptConfirmation: false });
        }
        else {
            await switch_1.returnToPreviousAccount({ previousAccount, previousWorkspace });
        }
    }
}
exports.default = setEdition;
