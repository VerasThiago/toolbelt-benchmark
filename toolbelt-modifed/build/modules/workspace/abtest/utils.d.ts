import { AppManifest } from '@vtex/api';
import { ABTester } from '../../../lib/clients/IOClients/apps/ABTester';
export declare const SIGNIFICANCE_LEVELS: {
    low: number;
    mid: number;
    high: number;
};
export declare const abtester: ABTester;
export declare const apps: import("@vtex/api").Apps;
export declare const formatDays: (days: number) => string;
export declare const formatDuration: (durationInMinutes: number) => string;
export declare const installedABTester: () => Promise<AppManifest>;
export declare const promptProductionWorkspace: (promptMessage: string) => Promise<string>;
export declare const promptConstraintDuration: () => Promise<string>;
export declare const promptProportionTrafic: () => Promise<string>;
