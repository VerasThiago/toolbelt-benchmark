import * as React from 'react';
import { AppReport, TestReport } from '../../../../lib/clients/IOClients/apps/Tester';
interface RealTimeReport {
    testId: string;
    poll: () => Promise<TestReport>;
    interval: number;
    initialReport: TestReport;
    requestedAt?: number;
}
interface AppTest {
    appId: string;
    specs: AppReport;
}
export interface ReportProps {
    completedAppTests: AppTest[];
    runningAppTests: AppTest[];
    testId?: string;
}
export interface AppProps {
    appId: string;
    specs: AppReport;
    testId?: string;
}
export declare const RealTimeReport: React.FunctionComponent<RealTimeReport>;
export {};
