"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ramda_1 = tslib_1.__importDefault(require("ramda"));
const Builder_1 = require("../../lib/clients/IOClients/apps/Builder");
const ErrorKinds_1 = require("../../lib/error/ErrorKinds");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const utils_1 = require("./utils");
const selectTSConfig = (tsconfigsFromBuilder, version, builder) => {
    const builderTSConfig = ramda_1.default.prop(builder, tsconfigsFromBuilder);
    if (builderTSConfig && ramda_1.default.has(version, builderTSConfig)) {
        return ramda_1.default.prop(version, builderTSConfig);
    }
    return null;
};
const getTSConfig = async () => {
    try {
        const builderClient = Builder_1.Builder.createClient({}, { retries: 3, timeout: 10000 });
        logger_1.default.info(`Fetching BuilderHub tsconfig`);
        return await builderClient.builderHubTsConfig();
    }
    catch (err) {
        logger_1.default.error('Failed to get BuilderHub tsconfig');
        throw err;
    }
};
exports.setupTSConfig = async (manifest, warnOnNoBuilderCandidate) => {
    logger_1.default.info(`Setting up tsconfig.json`);
    try {
        const tsconfigsFromBuilder = await getTSConfig();
        if (!tsconfigsFromBuilder) {
            if (warnOnNoBuilderCandidate) {
                logger_1.default.warn(`No builders candidates for TSConfig setup`);
            }
            return;
        }
        const buildersWithBaseTSConfig = ramda_1.default.compose(ramda_1.default.reject(ramda_1.default.isNil), ramda_1.default.mapObjIndexed(ramda_1.default.curry(selectTSConfig)(tsconfigsFromBuilder)), ramda_1.default.prop('builders'))(manifest);
        ramda_1.default.mapObjIndexed((baseTSConfig, builder) => {
            let currentTSConfig = {};
            try {
                currentTSConfig = utils_1.tsconfigEditor.read(builder);
            }
            catch (e) {
                if (e.code === 'ENOENT') {
                    logger_1.default.warn(`No tsconfig.json found in ${utils_1.tsconfigEditor.path(builder)}. Generating one...`);
                }
                else {
                    throw e;
                }
            }
            const newTSConfig = ramda_1.default.mergeDeepRight(currentTSConfig, baseTSConfig);
            logger_1.default.info(`Merging BuilderHub ${builder} tsconfig with local ${builder} tsconfig`);
            utils_1.tsconfigEditor.write(builder, newTSConfig);
        })(buildersWithBaseTSConfig);
        logger_1.default.info('Finished setting up tsconfig.json');
    }
    catch (err) {
        logger_1.default.error('Failed setting up tsconfig.json');
        ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
            kind: ErrorKinds_1.ErrorKinds.SETUP_TSCONFIG_ERROR,
            originalError: err,
        }).logErrorForUser();
    }
};
