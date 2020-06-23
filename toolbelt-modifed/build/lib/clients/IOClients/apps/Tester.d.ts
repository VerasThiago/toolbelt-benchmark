import { AppClient, InstanceOptions, IOContext } from '@vtex/api';
export interface SpecTestReport {
    testId: string;
    title: string[];
    state: string;
    body: string;
    stack?: string;
    error?: string;
}
export interface Screenshot {
    screenshotId: string;
    name?: string;
    testId: string;
    takenAt: string;
    path?: string;
    height: number;
    width: number;
}
export interface SpecReport {
    state: 'enqueued' | 'running' | 'passed' | 'failed' | 'skipped' | 'error';
    error?: string;
    report?: {
        stats: {
            suites: number;
            tests: number;
            passes: number;
            pending: number;
            skipped: number;
            failures: number;
        };
        tests: SpecTestReport[];
        video?: string;
        screenshots: Screenshot[];
    };
    logId?: string;
    specId?: string;
    lastUpdate: number;
}
export interface AppReport {
    [spec: string]: SpecReport;
}
export interface TestReport {
    [appId: string]: AppReport;
}
export interface TestOptions {
    monitoring: boolean;
    integration: boolean;
    authToken?: string;
    appKey?: string;
    appToken?: string;
}
declare type Spec = string;
export interface TestRequest {
    testId: string;
    options: TestOptions;
    testers: {
        [tester: string]: {
            [appId: string]: Spec[];
        };
    };
    requestedAt: number;
}
export declare class Tester extends AppClient {
    static DEFAULT_RETRIES: number;
    static DEFAULT_TIMEOUT: number;
    static createClient(customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): Tester;
    constructor(context: IOContext, options?: InstanceOptions);
    report(testId: string): Promise<TestReport>;
    test(options: TestOptions, appId?: string): Promise<TestRequest>;
}
export {};
