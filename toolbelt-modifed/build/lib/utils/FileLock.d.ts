export declare class FileLock {
    private lockPath;
    static readonly LOCK_STALE_TIME: number;
    readonly lockName: string;
    readonly lockDir: string;
    locked: boolean;
    private releaseLock;
    constructor(lockPath: string);
    lock(): Promise<void>;
    unlock(): Promise<void>;
}
