"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NpmClient_1 = require("../../lib/clients/NpmClient");
const ErrorKinds_1 = require("../../lib/error/ErrorKinds");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const TelemetryCollector_1 = require("../../lib/telemetry/TelemetryCollector");
const DeprecationCheckerStore_1 = require("./DeprecationCheckerStore");
exports.checkForDeprecate = async (store, pkgName, pkgVersion) => {
    try {
        const { deprecated } = await NpmClient_1.NpmClient.getPackageMetadata(pkgName, pkgVersion);
        store.setVersionDeprecationInfo({
            versionChecked: pkgVersion,
            deprecated: deprecated != null,
        });
        store.setLastDeprecationCheck(Date.now());
        process.exit();
    }
    catch (err) {
        const telemetryCollector = TelemetryCollector_1.TelemetryCollector.getCollector();
        telemetryCollector.registerError(ErrorReport_1.ErrorReport.create({
            kind: ErrorKinds_1.ErrorKinds.DEPRECATION_CHECK_ERROR,
            originalError: err,
        }));
        telemetryCollector.flush();
        process.exit(1);
    }
};
if (require.main === module) {
    // eslint-disable-next-line prefer-destructuring
    const storeFilePath = process.argv[2];
    const store = new DeprecationCheckerStore_1.DeprecationCheckerStore(storeFilePath);
    // eslint-disable-next-line prefer-destructuring
    const pkgName = process.argv[3];
    // eslint-disable-next-line prefer-destructuring
    const pkgVersion = process.argv[4];
    exports.checkForDeprecate(store, pkgName, pkgVersion);
}
