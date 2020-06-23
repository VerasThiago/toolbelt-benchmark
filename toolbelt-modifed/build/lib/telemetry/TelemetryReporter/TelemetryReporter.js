"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const ToolbeltTelemetry_1 = require("../../clients/IOClients/apps/ToolbeltTelemetry");
const ErrorKinds_1 = require("../../error/ErrorKinds");
const ErrorReport_1 = require("../../error/ErrorReport");
const PendingTelemetryDataManager_1 = require("./PendingTelemetryDataManager");
class TelemetryReporter {
    constructor(telemetryClient) {
        this.telemetryClient = telemetryClient;
        this.pendingDataManager = PendingTelemetryDataManager_1.PendingTelemetryDataManager.getSingleton();
    }
    static getTelemetryReporter() {
        const telemetryClient = ToolbeltTelemetry_1.ToolbeltTelemetry.createClient({}, { retries: TelemetryReporter.RETRIES, timeout: TelemetryReporter.TIMEOUT });
        return new TelemetryReporter(telemetryClient);
    }
    async reportTelemetryFile(telemetryObjFilePath) {
        try {
            const { errors, metrics } = await fs_extra_1.readJson(telemetryObjFilePath);
            await this.reportErrors(errors);
            await this.reportMetrics(metrics);
            await fs_extra_1.remove(telemetryObjFilePath);
        }
        catch (err) {
            this.registerMetaError(err);
        }
    }
    async moveTelemetryFileToPendingData(telemetryObjFilePath) {
        try {
            await this.pendingDataManager.acquireLock();
            await this.pendingDataManager.moveTelemetryFileToPending(telemetryObjFilePath);
            await this.pendingDataManager.releaseLock();
            await fs_extra_1.remove(telemetryObjFilePath);
        }
        catch (err) {
            this.registerMetaError(err);
        }
    }
    async sendPendingData() {
        try {
            await this.pendingDataManager.acquireLock();
            await this.pendingDataManager.createPendingDirMetrics();
            const pendingFiles = await this.pendingDataManager.getFilePaths();
            await Promise.all(pendingFiles.map(async (pendingFilePath) => {
                try {
                    const { errors, metrics } = await fs_extra_1.readJson(pendingFilePath);
                    await this.reportErrors(errors);
                    await this.reportMetrics(metrics);
                    await fs_extra_1.remove(pendingFilePath);
                }
                catch (err) {
                    this.registerMetaError(err);
                }
            }));
            await this.pendingDataManager.releaseLock();
        }
        catch (err) {
            this.registerMetaError(err);
        }
    }
    async reportErrors(errors) {
        if (!(errors === null || errors === void 0 ? void 0 : errors.length)) {
            return;
        }
        try {
            await this.telemetryClient.reportErrors(errors);
        }
        catch (err) {
            this.handleReportingError({ errors }, err);
        }
    }
    async reportMetrics(metrics) {
        if (!(metrics === null || metrics === void 0 ? void 0 : metrics.length)) {
            return;
        }
        try {
            await this.telemetryClient.reportMetrics(metrics);
        }
        catch (err) {
            this.handleReportingError({ metrics }, err);
        }
    }
    handleReportingError(pendingObject, reportingError) {
        this.pendingDataManager.registerPendingFile(pendingObject);
        this.registerMetaError(reportingError);
    }
    registerMetaError(error) {
        this.pendingDataManager.registerPendingFile({
            errors: [
                ErrorReport_1.ErrorReport.create({
                    kind: ErrorKinds_1.ErrorKinds.TELEMETRY_REPORTER_ERROR,
                    originalError: error,
                }).toObject(),
            ],
        });
    }
}
exports.TelemetryReporter = TelemetryReporter;
TelemetryReporter.RETRIES = 3;
TelemetryReporter.TIMEOUT = 30 * 1000;
