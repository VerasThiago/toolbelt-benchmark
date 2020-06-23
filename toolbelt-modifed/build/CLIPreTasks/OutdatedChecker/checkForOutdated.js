"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initTime = process.hrtime();
const ToolbeltConfig_1 = require("../../lib/clients/IOClients/apps/ToolbeltConfig");
const ErrorKinds_1 = require("../../lib/error/ErrorKinds");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const TelemetryCollector_1 = require("../../lib/telemetry/TelemetryCollector");
const hrTimeToMs_1 = require("../../lib/utils/hrTimeToMs");
const OutdatedCheckerStore_1 = require("./OutdatedCheckerStore");
exports.checkForOutdated = async (store, pkgVersion) => {
    try {
        const client = ToolbeltConfig_1.ToolbeltConfig.createClient({}, { retries: 3 });
        const { validVersion } = await client.versionValidate(pkgVersion);
        store.setOutdatedInfo({
            versionChecked: pkgVersion,
            outdated: validVersion === false,
        });
        store.setLastOutdatedCheck(Date.now());
    }
    catch (err) {
        const telemetryCollector = TelemetryCollector_1.TelemetryCollector.getCollector();
        const errorReport = telemetryCollector.registerError(ErrorReport_1.ErrorReport.create({
            kind: ErrorKinds_1.ErrorKinds.OUTDATED_CHECK_ERROR,
            originalError: err,
        }));
        console.error('Error checking for outdated', JSON.stringify(errorReport.toObject(), null, 2));
        telemetryCollector.flush();
    }
};
if (require.main === module) {
    // eslint-disable-next-line prefer-destructuring
    const storeFilePath = process.argv[2];
    const store = new OutdatedCheckerStore_1.OutdatedCheckerStore(storeFilePath);
    // eslint-disable-next-line prefer-destructuring
    const pkgVersion = process.argv[3];
    exports.checkForOutdated(store, pkgVersion);
    console.log(`Finished checking for outdated after ${hrTimeToMs_1.hrTimeToMs(process.hrtime(initTime))}`);
}
