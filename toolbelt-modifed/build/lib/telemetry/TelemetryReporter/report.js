"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initTime = process.hrtime();
const SessionManager_1 = require("../../session/SessionManager");
const TelemetryStore_1 = require("../TelemetryStore");
const PendingTelemetryDataManager_1 = require("./PendingTelemetryDataManager");
const TelemetryReporter_1 = require("./TelemetryReporter");
const reportTelemetry = async () => {
    const reportTime = process.hrtime();
    const telemetryObjFilePath = process.argv[3];
    const reporter = TelemetryReporter_1.TelemetryReporter.getTelemetryReporter();
    const { account, workspace, tokenObj } = SessionManager_1.SessionManager.getSingleton();
    if (!account || !workspace || !tokenObj.isValid()) {
        await reporter.moveTelemetryFileToPendingData(telemetryObjFilePath);
    }
    else {
        await reporter.reportTelemetryFile(telemetryObjFilePath);
        await reporter.sendPendingData();
    }
    PendingTelemetryDataManager_1.PendingTelemetryDataManager.getSingleton().registerPendingMetaMetric("telemetry:reportTime" /* REPORT_TIME */, process.hrtime(reportTime));
};
const prepareNewPendingFiles = async () => {
    const pendingDataManager = PendingTelemetryDataManager_1.PendingTelemetryDataManager.getSingleton();
    try {
        await pendingDataManager.acquireLock();
        await pendingDataManager.createPendingFiles();
        await pendingDataManager.ensureTelemetryDirMaxSize();
        await pendingDataManager.releaseLock();
    }
    catch (err) {
        // At this point there's nothing much we can do, we just console.error for when the child_process is being investigated
        console.error(err);
    }
};
const start = async () => {
    const store = new TelemetryStore_1.TelemetryLocalStore(process.argv[2]);
    PendingTelemetryDataManager_1.PendingTelemetryDataManager.getSingleton().registerPendingMetaMetric("telemetry:startTime" /* START_TIME */, process.hrtime(initTime));
    await reportTelemetry();
    await prepareNewPendingFiles();
    store.setLastRemoteFlush(Date.now());
    process.exit();
};
if (require.main === module) {
    process.on('exit', () => console.log('Finished reporting telemetry'));
    start();
}
