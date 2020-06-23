"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const env_1 = require("../../env");
const errors_1 = require("../../errors");
const manifest_1 = require("../../lib/manifest");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const utils_1 = require("./utils");
const Router_1 = require("../../lib/clients/IOClients/infra/Router");
const unprefixName = (str) => {
    return str.split(':').pop();
};
const invalidAppMessage = 'Invalid app format, please use <vendor>.<name>, <vendor>.<name>@<version>';
const infraLatestVersion = async (app) => {
    var _a;
    try {
        const router = Router_1.createRouterClient();
        const { versions } = await router.getAvailableVersions(app);
        const latest = utils_1.pickLatestVersion(versions[env_1.region()]);
        return utils_1.wildVersionByMajor(latest);
    }
    catch (err) {
        if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            throw new errors_1.CommandError(`App ${chalk_1.default.green(`infra:${app}`)} not found`);
        }
        throw err;
    }
};
const getVersion = (appName) => {
    const isInfra = appName.startsWith('infra:');
    const name = appName.includes(':') ? unprefixName(appName) : appName;
    return isInfra ? infraLatestVersion(name) : utils_1.appLatestMajor(name);
};
const addApp = async (app, manifest) => {
    const [appName, version] = app.split('@');
    const sanitizedVersion = version !== null && version !== void 0 ? version : (await getVersion(appName));
    await manifest.addDependency(appName, sanitizedVersion);
    logger_1.default.info(`Added ${chalk_1.default.green(`${appName}@${sanitizedVersion}`)}`);
};
const addApps = async (apps, manifest) => {
    try {
        for (const app of apps) {
            logger_1.default.debug('Starting to add app', app);
            if (!manifest_1.ManifestValidator.dependencyName.test(app)) {
                throw new errors_1.CommandError(invalidAppMessage);
            }
            // eslint-disable-next-line no-await-in-loop
            await addApp(app, manifest);
        }
    }
    catch (err) {
        logger_1.default.warn(`The following app${apps.length > 1 ? 's were' : ' was'} not added: ${apps.join(', ')}`);
        throw err;
    }
};
exports.default = async (apps) => {
    const manifest = await manifest_1.ManifestEditor.getManifestEditor();
    logger_1.default.debug(`Adding app${apps.length > 1 ? 's' : ''}: ${apps.join(', ')}`);
    try {
        await addApps(apps, manifest);
    }
    catch (err) {
        if (err instanceof errors_1.CommandError) {
            logger_1.default.error(err.message);
            return;
        }
        throw err;
    }
};
