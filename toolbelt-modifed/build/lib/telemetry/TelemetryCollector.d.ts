import { ErrorReportSerializableObj } from '@vtex/node-error-report';
import { ErrorReport } from '../error/ErrorReport';
import { Metric, MetricReport, MetricReportObj } from '../metrics/MetricReport';
import { ITelemetryLocalStore } from './TelemetryStore';
export interface TelemetryFile {
    errors?: ErrorReportSerializableObj[];
    metrics?: MetricReportObj[];
}
export declare class TelemetryCollector {
    private store;
    private static readonly REMOTE_FLUSH_INTERVAL;
    static readonly TELEMETRY_LOCAL_DIR: string;
    private static telemetryCollectorSingleton;
    static getCollector(): TelemetryCollector;
    private errors;
    private metrics;
    constructor(store: ITelemetryLocalStore);
    registerError(error: ErrorReport | Error | any): ErrorReport;
    registerMetric(metric: Metric): MetricReport;
    flush(forceRemoteFlush?: boolean): void;
}
