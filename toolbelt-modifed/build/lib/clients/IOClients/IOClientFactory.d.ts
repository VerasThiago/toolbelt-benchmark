import { InstanceOptions, IOClient, IOContext } from '@vtex/api';
interface IOContextOptions {
    account?: string;
    authToken?: string;
    region?: string;
    workspace?: string;
}
export declare class IOClientFactory {
    static DEFAULT_TIMEOUT: number;
    private static createDummyLogger;
    static createIOContext(opts?: IOContextOptions): IOContext;
    static createClient<T extends IOClient>(ClientClass: typeof IOClient, customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): T;
}
export {};
