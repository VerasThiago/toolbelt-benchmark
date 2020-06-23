"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const fs_extra_1 = require("fs-extra");
const globby_1 = tslib_1.__importDefault(require("globby"));
const path_1 = require("path");
const MetricReport_1 = require("../../metrics/MetricReport");
const FileLock_1 = require("../../utils/FileLock");
const hrTimeToMs_1 = require("../../utils/hrTimeToMs");
const TelemetryCollector_1 = require("../TelemetryCollector");
class PendingTelemetryDataManager {
    constructor(pendingDataDir) {
        this.pendingDataDir = pendingDataDir;
        const dataPendingLockName = 'reporter.lock';
        const dataPendingLockPath = path_1.join(pendingDataDir, dataPendingLockName);
        this.dataPendingLock = new FileLock_1.FileLock(dataPendingLockPath);
        this.pendingTelemetryFilesToCreate = [];
        this.pendingMetaMetrics = MetricReport_1.MetricReport.create({
            command: 'not-applicable',
        });
    }
    static getSingleton() {
        if (!PendingTelemetryDataManager.singleton) {
            PendingTelemetryDataManager.singleton = new PendingTelemetryDataManager(PendingTelemetryDataManager.PENDING_DATA_DIR);
        }
        return PendingTelemetryDataManager.singleton;
    }
    async acquireLock() {
        const getLockTime = process.hrtime();
        await this.dataPendingLock.lock();
        this.registerPendingMetaMetric("telemetry:pendingData:acquireLockTime" /* PENDING_DATA_ACQUIRE_LOCK_TIME */, process.hrtime(getLockTime));
    }
    releaseLock() {
        return this.dataPendingLock.unlock();
    }
    async ensureTelemetryDirMaxSize() {
        const { totalDirSize, numberOfFiles } = await this.getPendingDirStats();
        if (totalDirSize > PendingTelemetryDataManager.MAX_TELEMETRY_DIR_SIZE ||
            numberOfFiles > PendingTelemetryDataManager.MAX_TELEMETRY_DIR_NUMBER_OF_FILES) {
            await fs_extra_1.remove(TelemetryCollector_1.TelemetryCollector.TELEMETRY_LOCAL_DIR);
        }
    }
    async getFilePaths() {
        await fs_extra_1.ensureDir(this.pendingDataDir);
        const pendingFiles = (await fs_extra_1.readdir(this.pendingDataDir)).filter(fileName => fileName !== this.dataPendingLock.lockName);
        return pendingFiles.map(pendingFile => path_1.join(this.pendingDataDir, pendingFile));
    }
    async moveTelemetryFileToPending(filePath) {
        return fs_extra_1.move(filePath, this.newPendingFilePath());
    }
    registerPendingFile(content) {
        this.pendingTelemetryFilesToCreate.push(content);
    }
    registerPendingMetaMetric(metricName, latency) {
        this.pendingMetaMetrics.addMetric(metricName, hrTimeToMs_1.hrTimeToMs(latency));
    }
    async createPendingFiles() {
        await fs_extra_1.ensureDir(this.pendingDataDir);
        this.flushPendingMetaMetrics();
        await Promise.all(this.pendingTelemetryFilesToCreate.map(async (fileContent) => {
            try {
                await fs_extra_1.writeJson(this.newPendingFilePath(), fileContent);
            }
            catch (err) {
                // At this point there's nothing much we can do, we just console.error for when the child_process is being investigated
                console.error(err);
            }
        }));
        this.pendingTelemetryFilesToCreate = [];
    }
    async createPendingDirMetrics() {
        const stats = await this.getPendingDirStats();
        this.pendingMetaMetrics.addMetrics({
            ["telemetry:pendingData:files" /* PENDING_DATA_FILES */]: stats.numberOfFiles,
            ["telemetry:pendingData:dirSize" /* PENDING_DATA_DIR_SIZE */]: stats.totalDirSize,
            ["telemetry:pendingData:maxFileSize" /* PENDING_DATA_MAX_FILE_SIZE */]: stats.maxFileSize,
        });
    }
    newPendingFilePath() {
        return path_1.join(this.pendingDataDir, crypto_1.randomBytes(8).toString('hex'));
    }
    flushPendingMetaMetrics() {
        this.pendingTelemetryFilesToCreate.push({ metrics: [this.pendingMetaMetrics.toObject()] });
        this.pendingMetaMetrics = MetricReport_1.MetricReport.create({
            command: 'not-applicable',
        });
    }
    async getPendingDirStats() {
        const pendingFiles = await globby_1.default('**', { cwd: this.pendingDataDir, absolute: true });
        let maxFileSize = 0;
        let pendingDirSize = 0;
        await Promise.all(pendingFiles.map(async (file) => {
            const fileStats = await fs_extra_1.stat(file);
            pendingDirSize += fileStats.size;
            if (fileStats.size > maxFileSize) {
                maxFileSize = fileStats.size;
            }
        }));
        return {
            maxFileSize,
            numberOfFiles: pendingFiles.length,
            totalDirSize: pendingDirSize,
        };
    }
}
exports.PendingTelemetryDataManager = PendingTelemetryDataManager;
PendingTelemetryDataManager.PENDING_DATA_DIR = path_1.join(TelemetryCollector_1.TelemetryCollector.TELEMETRY_LOCAL_DIR, 'pendingData');
PendingTelemetryDataManager.MAX_TELEMETRY_DIR_SIZE = 10 * 1000 * 1000;
PendingTelemetryDataManager.MAX_TELEMETRY_DIR_NUMBER_OF_FILES = 500;
