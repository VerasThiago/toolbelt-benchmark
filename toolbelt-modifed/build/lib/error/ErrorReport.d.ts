import { ErrorReportBase, ErrorReportBaseConstructorArgs, ErrorReportCreateArgs } from '@vtex/node-error-report';
interface CustomErrorReportCreateArgs extends ErrorReportCreateArgs {
    shouldRemoteReport?: boolean;
}
interface CustomErrorReportBaseConstructorArgs extends ErrorReportBaseConstructorArgs {
    shouldRemoteReport: boolean;
}
declare type ErrorLogLevel = 'error' | 'debug';
interface LogToUserOptions {
    coreLogLevelDefault?: ErrorLogLevel;
    requestDataLogLevelDefault?: ErrorLogLevel;
    logLevels?: {
        core?: {
            errorId?: ErrorLogLevel;
            errorMessage?: ErrorLogLevel;
            errorKind?: ErrorLogLevel;
        };
        requestData?: {
            requestInfo?: ErrorLogLevel;
            requestStatus?: ErrorLogLevel;
        };
    };
}
export declare class ErrorReport extends ErrorReportBase {
    static checkIfShouldRemoteReport(err: Error | any): boolean;
    static create(args: CustomErrorReportCreateArgs): ErrorReport;
    static createAndMaybeRegisterOnTelemetry(args: CustomErrorReportCreateArgs): ErrorReport;
    shouldRemoteReport: boolean;
    constructor(args: CustomErrorReportBaseConstructorArgs);
    logErrorForUser(opts?: LogToUserOptions): this;
    maybeSendToTelemetry(): this;
}
export {};
