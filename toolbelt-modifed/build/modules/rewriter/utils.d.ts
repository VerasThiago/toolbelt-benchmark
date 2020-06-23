import { Redirect } from '../../lib/clients/IOClients/apps/Rewriter';
export declare const DELIMITER = ";";
export declare const MAX_ENTRIES_PER_REQUEST = 10;
export declare const METAINFO_FILE = ".vtex_redirects_metainfo.json";
export declare const MAX_RETRIES = 10;
export declare const RETRY_INTERVAL_S = 5;
export declare const sleep: (milliseconds: any) => Promise<unknown>;
export declare const showGraphQLErrors: (e: any) => boolean;
export declare const handleReadError: (path: string) => (error: any) => never;
export declare const readCSV: (path: string) => Promise<Redirect[]>;
export declare const splitJsonArray: (data: any) => any;
export declare const progressBar: (message: string, curr: number, total: number) => any;
export declare const validateInput: (schema: any, routes: any) => void;
export declare const saveMetainfo: (metainfo: any, metainfoType: string, fileHash: string, counter: number, data?: {}) => void;
export declare const deleteMetainfo: (metainfo: any, metainfoType: string, fileHash: string) => void;
export declare const encode: (x: string) => string;
