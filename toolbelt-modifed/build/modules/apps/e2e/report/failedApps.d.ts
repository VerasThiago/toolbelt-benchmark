import * as React from 'react';
import { SpecReport } from '../../../../lib/clients/IOClients/apps/Tester';
interface SpecProps {
    spec: string;
    report: SpecReport;
    hubTestId: string;
}
export declare const FailedSpec: React.FunctionComponent<SpecProps>;
export {};
