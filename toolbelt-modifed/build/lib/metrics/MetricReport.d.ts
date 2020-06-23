export interface Metric {
    command: string;
    [metricName: string]: number | string;
}
export interface MetricReportObj {
    metric: Metric;
    env: MetricEnv;
}
interface MetricEnv {
    account: string;
    workspace: string;
    toolbeltVersion: string;
    nodeVersion: string;
    platform: string;
}
interface MetricReportArguments {
    metric: Metric;
    env: MetricEnv;
}
export declare class MetricReport {
    static create(metric: Metric, env?: MetricEnv): MetricReport;
    constructor({ metric, env }: MetricReportArguments);
    readonly env: MetricEnv;
    metric: Metric;
    addMetric(metricName: string, value: number | string): void;
    addMetrics(metrics: Record<string, number | string>): void;
    toObject(): MetricReportObj;
}
export {};
