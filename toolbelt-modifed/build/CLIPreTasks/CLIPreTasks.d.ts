export declare class CLIPreTasks {
    private pkg;
    static readonly PRETASKS_LOCAL_DIR: string;
    static getCLIPreTasks(pkgJson: any): CLIPreTasks;
    constructor(pkg: any);
    private ensureCompatibleNode;
    private removeOutdatedPaths;
    runTasks(): void;
}
