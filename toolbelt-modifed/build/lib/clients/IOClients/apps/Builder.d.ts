/// <reference types="node" />
import { AppClient, InstanceOptions, IOContext } from '@vtex/api';
interface StickyOptions {
    sticky?: boolean;
    stickyHint?: string;
    tag?: string;
}
export interface RequestParams {
    tsErrorsAsWarnings?: boolean;
    skipSemVerEnsure?: boolean;
}
export interface BuildResult {
    availability?: AvailabilityResponse;
    code?: string;
    message?: any;
    timeNano?: number;
}
export interface AvailabilityResponse {
    host: string | undefined;
    hostname: string | undefined;
    score: number;
}
export declare class Builder extends AppClient {
    private static TOO_MANY_HOST_CHANGES;
    static createClient(customContext?: Partial<IOContext>, customOptions?: Partial<InstanceOptions>): Builder;
    private stickyHost;
    private hostChanges;
    constructor(ioContext: IOContext, opts?: InstanceOptions);
    availability: (app: string, hintIndex: number) => Promise<{
        host: string;
        hostname: string;
        score: number;
    }>;
    clean: (app: string) => Promise<BuildResult>;
    getPinnedDependencies: () => Promise<any>;
    publishApp: (app: string, zipFile: Buffer, stickyOptions?: StickyOptions, params?: RequestParams) => Promise<BuildResult>;
    testApp: (app: string, zipFile: Buffer, stickyOptions?: StickyOptions, params?: RequestParams) => Promise<BuildResult>;
    linkApp: (app: string, linkID: string, zipFile: Buffer, stickyOptions?: StickyOptions, params?: RequestParams) => Promise<BuildResult>;
    relinkApp: (app: string, changes: import("../../../../modules/apps/ProjectUploader").FileToSend[], linkID: string, params?: RequestParams) => Promise<BuildResult>;
    builderHubTsConfig: () => Promise<any>;
    typingsInfo: () => Promise<any>;
    private sendZipFile;
    private updateStickyHost;
}
export {};
