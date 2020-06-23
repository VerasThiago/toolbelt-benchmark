import { ToolbeltTelemetry } from '../../clients/IOClients/apps/ToolbeltTelemetry';
export declare class TelemetryReporter {
    private telemetryClient;
    private static readonly RETRIES;
    private static readonly TIMEOUT;
    static getTelemetryReporter(): TelemetryReporter;
    private pendingDataManager;
    constructor(telemetryClient: ToolbeltTelemetry);
    reportTelemetryFile(telemetryObjFilePath: string): Promise<void>;
    moveTelemetryFileToPendingData(telemetryObjFilePath: string): Promise<void>;
    sendPendingData(): Promise<void>;
    private reportErrors;
    private reportMetrics;
    private handleReportingError;
    private registerMetaError;
}
