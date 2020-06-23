export declare abstract class SessionsPersisterBase {
    abstract clearData(): void;
    abstract getAccount(): string;
    abstract saveAccount(account: string): void;
    abstract getLastAccount(): string;
    abstract saveLastAccount(account: string): void;
    abstract getWorkspace(): string;
    abstract saveWorkspace(workspace: string): void;
    abstract getLastWorkspace(): string;
    abstract saveLastWorkspace(workspace: string): void;
    abstract getToken(): string;
    abstract saveToken(token: string): void;
    abstract getLogin(): string;
    abstract saveLogin(login: string): void;
    abstract getAccountToken(account: string): string;
    abstract saveAccountToken(account: string, token: string): any;
}
export declare class SessionsPersister extends SessionsPersisterBase {
    private static readonly SESSION_STORE_PATH;
    private static readonly TOKEN_CACHE_STORE_PATH;
    private static readonly WORKSPACE_METADATA_STORE_PATH;
    static getSingleton(): SessionsPersister;
    private oldConfigstore;
    private tokenCacheStore;
    private sessionStore;
    private workspaceMetadataStore;
    constructor();
    clearData(): void;
    getAccount(): any;
    saveAccount(account: string): void;
    getLastAccount(): any;
    saveLastAccount(account: string): void;
    getWorkspace(): any;
    saveWorkspace(workspace: string): void;
    getLastWorkspace(): any;
    saveLastWorkspace(workspace: string): void;
    getToken(): any;
    saveToken(token: string): void;
    getLogin(): any;
    saveLogin(login: string): void;
    getAccountToken(account: string): any;
    saveAccountToken(account: string, token: string): void;
}
