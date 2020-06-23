import { ErrorReport } from '../error/ErrorReport';
import { MetricReport } from '../metrics/MetricReport';
export interface ITelemetryLocalStore {
    storeFilePath: string;
    getErrors: () => ErrorReport[];
    getMetrics: () => MetricReport[];
    getLastRemoteFlush: () => any;
    setLastRemoteFlush: (date: number) => void;
    setErrors: (errors: ErrorReport[]) => void;
    setMetrics: (metrics: MetricReport[]) => void;
    clear: () => void;
}
export declare class TelemetryLocalStore implements ITelemetryLocalStore {
    readonly storeFilePath: string;
    private store;
    constructor(storeFilePath: string);
    getErrors(): any;
    getMetrics(): MetricReport[];
    getLastRemoteFlush(): any;
    setErrors(errors: ErrorReport[]): void;
    setMetrics(metrics: MetricReport[]): void;
    setLastRemoteFlush(date: number): void;
    clear(): void;
}
