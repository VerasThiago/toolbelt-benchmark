import { TelemetryFile } from '../TelemetryCollector';
export declare class PendingTelemetryDataManager {
    private pendingDataDir;
    static readonly PENDING_DATA_DIR: string;
    private static readonly MAX_TELEMETRY_DIR_SIZE;
    private static readonly MAX_TELEMETRY_DIR_NUMBER_OF_FILES;
    private static singleton;
    static getSingleton(): PendingTelemetryDataManager;
    private pendingTelemetryFilesToCreate;
    private pendingMetaMetrics;
    private dataPendingLock;
    constructor(pendingDataDir: string);
    acquireLock(): Promise<void>;
    releaseLock(): Promise<void>;
    ensureTelemetryDirMaxSize(): Promise<void>;
    getFilePaths(): Promise<string[]>;
    moveTelemetryFileToPending(filePath: string): Promise<void>;
    registerPendingFile(content: TelemetryFile): void;
    registerPendingMetaMetric(metricName: string, latency: [number, number]): void;
    createPendingFiles(): Promise<void>;
    createPendingDirMetrics(): Promise<void>;
    private newPendingFilePath;
    private flushPendingMetaMetrics;
    private getPendingDirStats;
}
