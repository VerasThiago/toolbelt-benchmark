import { AppClient, InstanceOptions, IOContext } from '@vtex/api';
import { ErrorReportSerializableObj } from '@vtex/node-error-report';
import { MetricReportObj } from '../../../metrics/MetricReport';
export declare class ToolbeltTelemetry extends AppClient {
    static createClient(customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): ToolbeltTelemetry;
    constructor(ioContext: IOContext, opts?: InstanceOptions);
    reportErrors(errors: ErrorReportSerializableObj[]): Promise<void>;
    reportMetrics(metrics: MetricReportObj[]): Promise<void>;
}
