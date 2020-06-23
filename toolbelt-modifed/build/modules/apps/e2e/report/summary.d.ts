import * as React from 'react';
import { ReportProps } from './index';
interface SummaryProps extends ReportProps {
    testId: string;
    requestedAt?: number;
}
export declare const Summary: React.FunctionComponent<SummaryProps>;
export {};
