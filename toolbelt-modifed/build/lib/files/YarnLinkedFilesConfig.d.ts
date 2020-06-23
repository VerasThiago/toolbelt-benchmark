export declare class YarnSymlinkedModulesConfig {
    private projectSrc;
    static createConfig(projectSrc: string): Promise<YarnSymlinkedModulesConfig>;
    private stack;
    private graph;
    private _metadata;
    constructor(projectSrc: string);
    get metadata(): Record<string, string>;
    get symlinkedDepsDirs(): string[];
    get symlinkedModules(): string[];
    get symlinkedDependencies(): {
        moduleName: string;
        path: string;
    }[];
    init(): Promise<void>;
    toJson(): string;
    private discoverDependencies;
    private getModuleRealPath;
    private getAllLinkedModules;
    private getLinkedScopedModules;
    private getDirs;
    private addSubDependenciesToStack;
    private addModulesMetadata;
}
