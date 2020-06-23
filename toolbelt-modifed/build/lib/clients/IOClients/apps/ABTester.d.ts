import { AppClient, InstanceOptions, IOContext } from '@vtex/api';
export declare class ABTester extends AppClient {
    static createClient(customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): ABTester;
    constructor(context: IOContext, options: InstanceOptions);
    finish: (workspace: string) => Promise<void>;
    customStart: (workspace: string, hours: number, proportion: number) => Promise<void>;
    startLegacy: (workspace: string, probability: number) => Promise<void>;
    start: (workspace: string) => Promise<void>;
    preview: (significanceLevel: number) => Promise<number>;
    status: () => Promise<any>;
}
