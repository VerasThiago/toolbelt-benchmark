"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Apps_1 = require("../../lib/clients/IOClients/infra/Apps");
const manifest_1 = require("../../lib/manifest");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const utils_1 = require("./utils");
const { unlink, unlinkAll, listLinks } = Apps_1.createAppsClient();
const unlinkApp = async (app) => {
    var _a, _b;
    manifest_1.ManifestValidator.validateApp(app);
    try {
        logger_1.default.info('Starting to unlink app:', app);
        await unlink(app);
        logger_1.default.info('Successfully unlinked', app);
    }
    catch (e) {
        if (e.response.status === 404) {
            logger_1.default.error(`${app} is not linked in the current workspace. \
Make sure you typed the right app vendor, name and version.`);
        }
        else {
            logger_1.default.error(`Error unlinking ${app}.`, e.message);
            if ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) {
                logger_1.default.error(e.response.data.message);
            }
        }
    }
};
const unlinkApps = async (appsList) => {
    await utils_1.validateAppAction('unlink', appsList);
    await Promise.all(appsList.map(unlinkApp));
};
const unlinkAllApps = async () => {
    var _a, _b;
    try {
        logger_1.default.info('Starting to unlink all apps');
        await unlinkAll();
        logger_1.default.info('Successfully unlinked all apps');
    }
    catch (e) {
        logger_1.default.error('Error unlinking all apps.', e.message);
        if ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) {
            logger_1.default.error(e.response.data.message);
        }
    }
};
exports.default = async (optionalApps, options) => {
    const linkedApps = await listLinks();
    if (linkedApps.length === 0) {
        return logger_1.default.info('No linked apps?');
    }
    if (options.a || options.all) {
        return unlinkAllApps();
    }
    const appsList = optionalApps.length > 0 ? optionalApps : [(await manifest_1.ManifestEditor.getManifestEditor()).appLocator];
    return unlinkApps(appsList);
};
