"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const Apps_1 = require("../../lib/clients/IOClients/infra/Apps");
const manifest_1 = require("../../lib/manifest");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const utils_1 = require("./utils");
const { uninstallApp } = Apps_1.createAppsClient();
const promptAppUninstall = (appsList) => {
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    return prompts_1.promptConfirm(`Are you sure you want to uninstall ${appsList.join(', ')} from account ${chalk_1.default.blue(account)}, workspace ${chalk_1.default.green(workspace)}?`);
};
const uninstallApps = async (appsList) => {
    for (const app of appsList) {
        const appName = manifest_1.ManifestValidator.validateApp(app.split('@')[0], true);
        try {
            logger_1.default.debug('Starting to uninstall app', appName);
            // eslint-disable-next-line no-await-in-loop
            await uninstallApp(appName);
            logger_1.default.info(`Uninstalled app ${appName} successfully`);
        }
        catch (e) {
            logger_1.default.warn(`The following app was not uninstalled: ${appName}`);
            logger_1.default.error(`${e.response.status}: ${e.response.statusText}. ${e.response.data.message}`);
        }
    }
};
exports.default = async (optionalApps, options) => {
    const confirm = await utils_1.validateAppAction('uninstall', optionalApps);
    if (!confirm)
        return;
    const appsList = optionalApps.length > 0 ? optionalApps : [(await manifest_1.ManifestEditor.getManifestEditor()).appLocator];
    const preConfirm = options.y || options.yes;
    let promptAnswer;
    if (!preConfirm) {
        promptAnswer = await promptAppUninstall(appsList);
    }
    if (promptAnswer) {
        logger_1.default.debug(`Uninstalling app${appsList.length > 1 ? 's' : ''}: ${appsList.join(', ')}`);
        return uninstallApps(appsList);
    }
};
