export declare const createPathToFileObject: (root: string, prefix?: string) => (path: string) => BatchStream;
export declare class ProjectFilesManager {
    private static readonly DEFAULT_IGNORED_FILES;
    private static isTestOrMockPath;
    root: string;
    constructor(projectRoot: string);
    private getIgnoredPaths;
    getLocalFiles(test?: boolean): Promise<string[]>;
}
