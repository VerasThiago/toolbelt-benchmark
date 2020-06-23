import { Builder } from './lib/clients/IOClients/apps/Builder';
export declare const getSavedOrMostAvailableHost: (appId: string, builder: Builder, nHosts: number, timeout: number) => Promise<string>;
