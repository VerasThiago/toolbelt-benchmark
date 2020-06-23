"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = tslib_1.__importDefault(require("ramda"));
const env_1 = require("../../env");
const Builder_1 = require("../../lib/clients/IOClients/apps/Builder");
const ErrorKinds_1 = require("../../lib/error/ErrorKinds");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const SessionManager_1 = require("../../lib/session/SessionManager");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const utils_1 = require("../apps/utils");
const utils_2 = require("../utils");
const consts_1 = require("./consts");
const utils_3 = require("./utils");
const getVendor = (appId) => appId.split('.')[0];
const typingsURLRegex = /_v\/\w*\/typings/;
const appTypingsURL = async (appName, appMajorLocator, ignoreLinked) => {
    const { workspace, account } = SessionManager_1.SessionManager.getSingleton();
    const appId = ignoreLinked
        ? await utils_1.appIdFromRegistry(appName, appMajorLocator)
        : await utils_1.resolveAppId(appName, appMajorLocator);
    const vendor = getVendor(appId);
    const linked = utils_1.isLinked({ version: appId, vendor, name: '', builders: {} });
    const oldSuffix = `/_types/react`;
    const newSuffix = `/@types/${appName}`;
    const base = linked && !ignoreLinked
        ? `https://${workspace}--${account}.${env_1.publicEndpoint()}/_v/private/typings/linked/v1/${appId}/public`
        : `http://${vendor}.vtexassets.com/_v/public/typings/v1/${appId}/public`;
    logger_1.default.info(`Checking if ${chalk_1.default.bold(appId)} has new types format`);
    try {
        const newTypesExist = !(await utils_3.checkIfTarGzIsEmpty(base + newSuffix));
        return base + (newTypesExist ? newSuffix : oldSuffix);
    }
    catch (err) {
        logger_1.default.error(`Error checking if types package is empty for ${base + newSuffix}`);
        throw err;
    }
};
const appsWithTypingsURLs = async (appDependencies, ignoreLinked) => {
    const result = {};
    const appNamesAndDependencies = ramda_1.default.toPairs(appDependencies);
    await Promise.all(appNamesAndDependencies.map(async ([appName, appVersion]) => {
        try {
            result[appName] = await appTypingsURL(appName, appVersion, ignoreLinked);
        }
        catch (err) {
            logger_1.default.error(`Unable to generate typings URL for ${appName}@${appVersion}.`);
            ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
                kind: ErrorKinds_1.ErrorKinds.SETUP_TYPINGS_ERROR,
                originalError: err,
            }).logErrorForUser({
                coreLogLevelDefault: 'debug',
                logLevels: { core: { errorId: 'error' } },
            });
        }
    }));
    return result;
};
const getBuilderDependencies = (manifestDependencies, typingsData, version, builder) => {
    const builderTypingsData = ramda_1.default.prop(builder, typingsData);
    let injectedDependencies = {};
    if (builderTypingsData && ramda_1.default.has(version, builderTypingsData)) {
        injectedDependencies = ramda_1.default.path([version, 'injectedDependencies'], builderTypingsData);
    }
    return ramda_1.default.merge(manifestDependencies, injectedDependencies);
};
const injectTypingsInPackageJson = async (appDeps, ignoreLinked, builder) => {
    let packageJson;
    try {
        packageJson = utils_3.packageJsonEditor.read(builder);
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            logger_1.default.warn(`No package.json found in ${utils_3.packageJsonEditor.path(builder)}.`);
        }
        else
            logger_1.default.error(e);
        return;
    }
    logger_1.default.info(`Injecting typings on ${builder}'s package.json`);
    const oldDevDeps = packageJson.devDependencies || {};
    const oldTypingsEntries = ramda_1.default.filter(ramda_1.default.test(typingsURLRegex), oldDevDeps);
    const newTypingsEntries = await appsWithTypingsURLs(appDeps, ignoreLinked);
    if (!ramda_1.default.equals(oldTypingsEntries, newTypingsEntries)) {
        const cleanOldDevDeps = ramda_1.default.reject(ramda_1.default.test(typingsURLRegex), oldDevDeps);
        utils_3.packageJsonEditor.write(builder, {
            ...packageJson,
            ...{ devDependencies: utils_3.sortObject({ ...cleanOldDevDeps, ...newTypingsEntries }) },
        });
        try {
            utils_2.runYarn(builder, true);
        }
        catch (e) {
            logger_1.default.error(`Error running Yarn in ${builder}.`);
            ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
                kind: ErrorKinds_1.ErrorKinds.SETUP_TSCONFIG_ERROR,
                originalError: e,
            });
            utils_3.packageJsonEditor.write(builder, packageJson); // Revert package.json to original state.
        }
    }
};
exports.setupTypings = async (manifest, ignoreLinked, buildersWithTypes = consts_1.BUILDERS_WITH_TYPES) => {
    logger_1.default.info('Setting up typings');
    const appName = `${manifest.vendor}.${manifest.name}`;
    const appMajor = locator_1.toMajorRange(manifest.version);
    const builderClient = Builder_1.Builder.createClient({}, { retries: 2, timeout: 10000 });
    const builders = ramda_1.default.keys(ramda_1.default.prop('builders', manifest) || {});
    const filteredBuilders = ramda_1.default.intersection(builders, buildersWithTypes);
    try {
        logger_1.default.info('Fetching names of dependencies injected by BuilderHub');
        const typingsData = await builderClient.typingsInfo();
        const buildersWithAllDeps = filteredBuilders.map((builder) => {
            return {
                builder,
                deps: {
                    ...getBuilderDependencies(manifest.dependencies, typingsData, manifest.builders[builder], builder),
                    ...(builder === 'node' ? { [appName]: appMajor } : {}),
                },
            };
        });
        await Promise.all(buildersWithAllDeps.map(({ builder, deps }) => injectTypingsInPackageJson(deps, ignoreLinked, builder)));
        logger_1.default.info('Finished setting up typings');
    }
    catch (err) {
        ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
            kind: ErrorKinds_1.ErrorKinds.SETUP_TYPINGS_ERROR,
            originalError: err,
        }).logErrorForUser();
    }
};
