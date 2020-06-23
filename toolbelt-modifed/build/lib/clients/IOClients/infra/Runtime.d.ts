import { IOContext } from '@vtex/api';
export declare class Runtime {
    static createClient(): Runtime;
    private account;
    private workspace;
    constructor(context: IOContext);
    debugDotnetApp(appName: string, appVendor: string, appMajor: string, debugInst: string): Promise<void>;
}
