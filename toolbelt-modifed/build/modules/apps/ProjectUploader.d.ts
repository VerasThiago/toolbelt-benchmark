/// <reference types="node" />
import { Builder, RequestParams } from '../../lib/clients/IOClients/apps/Builder';
import { Readable } from 'stream';
export interface FileToSend {
    path: string;
    content: string | Readable | Buffer | NodeJS.ReadableStream;
    byteSize: number;
}
export declare type ChangeToSend = FileToSend;
export declare class ProjectSizeLimitError extends Error {
    projectByteSize: number;
    constructor(projectByteSize: number, maxByteSize: number);
}
export declare class ChangeSizeLimitError extends Error {
    changeByteSize: number;
    constructor(changeByteSize: number, maxByteSize: number);
}
export declare class ProjectUploader {
    private appName;
    private builderHubClient;
    static CHANGE_BYTESIZE_LIMIT: number;
    static PROJECT_BYTESIZE_LIMIT: number;
    static BYTES_PROJECT_SIZE_SCALE: number[];
    static getProjectUploader(appId: string, context: Context, clientTimeout?: number): ProjectUploader;
    static getProjectUploader(appId: string, builderHubClient: Builder): ProjectUploader;
    constructor(appName: string, builderHubClient: Builder);
    sendToPublish(files: FileToSend[], publishTag: string, params?: RequestParams): Promise<import("../../lib/clients/IOClients/apps/Builder").BuildResult>;
    sendToTest(files: FileToSend[], params?: RequestParams): Promise<import("../../lib/clients/IOClients/apps/Builder").BuildResult>;
    sendToLink(files: FileToSend[], linkID: string, params?: RequestParams): Promise<import("../../lib/clients/IOClients/apps/Builder").BuildResult>;
    sendToRelink(changes: ChangeToSend[], linkID: string, params?: RequestParams): Promise<import("../../lib/clients/IOClients/apps/Builder").BuildResult>;
    private checkSizeLimits;
    private prepareRequest;
    private checkForManifest;
    private getBuilderHubSticky;
    private compressFilesOnMemory;
}
