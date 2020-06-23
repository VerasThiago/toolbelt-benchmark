"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const pkgJson = tslib_1.__importStar(require("../../../package.json"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const Paths_1 = require("../constants/Paths");
const ErrorReport_1 = require("../error/ErrorReport");
const MetricReport_1 = require("../metrics/MetricReport");
const spawnUnblockingChildProcess_1 = require("../utils/spawnUnblockingChildProcess");
const TelemetryStore_1 = require("./TelemetryStore");
class TelemetryCollector {
    constructor(store) {
        this.store = store;
        this.errors = this.store.getErrors();
        this.metrics = this.store.getMetrics();
    }
    static getCollector() {
        if (!TelemetryCollector.telemetryCollectorSingleton) {
            const store = new TelemetryStore_1.TelemetryLocalStore(path_1.join(TelemetryCollector.TELEMETRY_LOCAL_DIR, `${pkgJson.name}-telemetry-store`));
            TelemetryCollector.telemetryCollectorSingleton = new TelemetryCollector(store);
        }
        return TelemetryCollector.telemetryCollectorSingleton;
    }
    registerError(error) {
        let errorReport;
        if (error instanceof ErrorReport_1.ErrorReport) {
            errorReport = error;
        }
        else {
            errorReport = ErrorReport_1.ErrorReport.create({ originalError: error });
        }
        if (errorReport.isErrorReported()) {
            return errorReport;
        }
        this.errors.push(errorReport);
        errorReport.markErrorAsReported();
        return errorReport;
    }
    registerMetric(metric) {
        if (metric instanceof MetricReport_1.MetricReport) {
            this.metrics.push(metric);
            return metric;
        }
        const metricReport = MetricReport_1.MetricReport.create(metric);
        this.metrics.push(metricReport);
        return metricReport;
    }
    flush(forceRemoteFlush = false) {
        const shouldRemoteFlush = forceRemoteFlush ||
            this.errors.length > 0 ||
            Date.now() - this.store.getLastRemoteFlush() >= TelemetryCollector.REMOTE_FLUSH_INTERVAL;
        if (!shouldRemoteFlush) {
            this.store.setErrors(this.errors);
            this.store.setMetrics(this.metrics);
            return;
        }
        this.store.setErrors([]);
        this.store.setMetrics([]);
        const obj = {
            errors: this.errors.map(err => err.toObject()),
            metrics: this.metrics.map(metric => metric.toObject()),
        };
        const objFilePath = path_1.join(TelemetryCollector.TELEMETRY_LOCAL_DIR, `${crypto_1.randomBytes(8).toString('hex')}.json`);
        try {
            fs_extra_1.ensureFileSync(objFilePath);
            fs_extra_1.writeJsonSync(objFilePath, obj); // Telemetry object should be saved in a file since it can be too large to be passed as a cli argument
            spawnUnblockingChildProcess_1.spawnUnblockingChildProcess(process.execPath, [
                path_1.join(__dirname, 'TelemetryReporter', 'report.js'),
                this.store.storeFilePath,
                objFilePath,
            ]);
        }
        catch (e) {
            logger_1.default.error('Error writing telemetry file. Error: ', e);
        }
    }
}
exports.TelemetryCollector = TelemetryCollector;
TelemetryCollector.REMOTE_FLUSH_INTERVAL = 1000 * 60 * 10; // Ten minutes
TelemetryCollector.TELEMETRY_LOCAL_DIR = Paths_1.PathConstants.TELEMETRY_FOLDER;
