"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const Registry_1 = require("../../lib/clients/IOClients/infra/Registry");
const manifest_1 = require("../../lib/manifest");
const SessionManager_1 = require("../../lib/session/SessionManager");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const manifest_2 = require("../../manifest");
const switch_1 = require("../auth/switch");
const prompts_1 = require("../prompts");
const switchToVendorMessage = (vendor) => {
    return `You are trying to deploy this app in an account that differs from the indicated vendor. Do you want to deploy in account ${chalk_1.default.blue(vendor)}?`;
};
const promptDeploy = (app) => prompts_1.promptConfirm(`Are you sure you want to deploy app ${app}`);
const deployRelease = async (app) => {
    const { vendor, name, version } = locator_1.parseLocator(app);
    const session = SessionManager_1.SessionManager.getSingleton();
    if (vendor !== session.account) {
        const canSwitchToVendor = await prompts_1.promptConfirm(switchToVendorMessage(vendor));
        if (!canSwitchToVendor) {
            return false;
        }
        await switch_1.switchAccount(vendor, {});
    }
    const context = { account: vendor, workspace: 'master', authToken: session.token };
    const registry = Registry_1.createRegistryClient(context);
    await registry.validateApp(`${vendor}.${name}`, version);
    return true;
};
const prepareDeploy = async (app, originalAccount, originalWorkspace) => {
    var _a;
    app = manifest_1.ManifestValidator.validateApp(app);
    try {
        logger_1.default.debug('Starting to deploy app:', app);
        const deployed = await deployRelease(app);
        if (deployed) {
            logger_1.default.info('Successfully deployed', app);
        }
    }
    catch (e) {
        const data = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data;
        const code = data === null || data === void 0 ? void 0 : data.code;
        if (code === 'app_is_not_rc') {
            logger_1.default.error(`App ${app} was already deployed.`);
        }
        else if (data === null || data === void 0 ? void 0 : data.message) {
            logger_1.default.error(data.message);
        }
        else {
            await switch_1.returnToPreviousAccount({ previousAccount: originalAccount, previousWorkspace: originalWorkspace });
            throw e;
        }
    }
    await switch_1.returnToPreviousAccount({ previousAccount: originalAccount, previousWorkspace: originalWorkspace });
};
exports.default = async (optionalApp, options) => {
    const preConfirm = options.y || options.yes;
    const { account: originalAccount, workspace: originalWorkspace } = SessionManager_1.SessionManager.getSingleton();
    const app = optionalApp || locator_1.toAppLocator(await manifest_2.getManifest());
    if (!preConfirm && !(await promptDeploy(app))) {
        return;
    }
    logger_1.default.debug(`Deploying app ${app}`);
    return prepareDeploy(app, originalAccount, originalWorkspace);
};
