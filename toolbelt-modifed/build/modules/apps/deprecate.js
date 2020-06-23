"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const Registry_1 = require("../../lib/clients/IOClients/infra/Registry");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const manifest_1 = require("../../lib/manifest");
const SessionManager_1 = require("../../lib/session/SessionManager");
const TelemetryCollector_1 = require("../../lib/telemetry/TelemetryCollector");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const switch_1 = require("../auth/switch");
const prompts_1 = require("../prompts");
let originalAccount;
let originalWorkspace;
const switchToVendorMessage = (vendor) => {
    return `You are trying to deprecate this app in an account that differs from the indicated vendor. Do you want to deprecate in account ${chalk_1.default.blue(vendor)}?`;
};
const promptDeprecate = (appsList) => prompts_1.promptConfirm(`Are you sure you want to deprecate app${appsList.length > 1 ? 's' : ''} ${chalk_1.default.green(appsList.join(', '))}?`);
const deprecateApp = async (app) => {
    const { vendor, name, version } = locator_1.parseLocator(app);
    const session = SessionManager_1.SessionManager.getSingleton();
    if (vendor !== session.account) {
        const canSwitchToVendor = await prompts_1.promptConfirm(switchToVendorMessage(vendor));
        if (!canSwitchToVendor) {
            return;
        }
        await switch_1.switchAccount(vendor, {});
    }
    const context = { account: vendor, workspace: 'master', authToken: session.token };
    const registry = Registry_1.createRegistryClient(context);
    return registry.deprecateApp(`${vendor}.${name}`, version);
};
const prepareAndDeprecateApps = async (appsList) => {
    for (const app of appsList) {
        manifest_1.ManifestValidator.validateApp(app);
        logger_1.default.debug('Starting to deprecate app:', app);
        try {
            // eslint-disable-next-line no-await-in-loop
            await deprecateApp(app);
            logger_1.default.info('Successfully deprecated', app);
        }
        catch (e) {
            const errReport = ErrorReport_1.ErrorReport.create({ originalError: e });
            if (e.response && e.response.status && e.response.status === 404) {
                logger_1.default.error(`Error deprecating ${app}. App not found`);
                errReport.logErrorForUser({ coreLogLevelDefault: 'debug' });
                TelemetryCollector_1.TelemetryCollector.getCollector().registerError(errReport);
            }
            else if (e.message && e.response.statusText) {
                logger_1.default.error(`Error deprecating ${app}. ${e.message}. ${e.response.statusText}`);
                errReport.logErrorForUser({ coreLogLevelDefault: 'debug' });
                TelemetryCollector_1.TelemetryCollector.getCollector().registerError(errReport);
                return switch_1.returnToPreviousAccount({ previousAccount: originalAccount, previousWorkspace: originalWorkspace });
            }
            else {
                // eslint-disable-next-line no-await-in-loop
                await switch_1.returnToPreviousAccount({ previousAccount: originalAccount, previousWorkspace: originalWorkspace });
                throw errReport;
            }
        }
    }
    await switch_1.returnToPreviousAccount({ previousAccount: originalAccount, previousWorkspace: originalWorkspace });
};
exports.default = async (optionalApps, options) => {
    const preConfirm = options.y || options.yes;
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    originalAccount = account;
    originalWorkspace = workspace;
    const appsList = optionalApps.length > 0 ? optionalApps : [(await manifest_1.ManifestEditor.getManifestEditor()).appLocator];
    if (!preConfirm && !(await promptDeprecate(appsList))) {
        return;
    }
    logger_1.default.debug(`Deprecating app${appsList.length > 1 ? 's' : ''}: ${appsList.join(', ')}`);
    return prepareAndDeprecateApps(appsList);
};
