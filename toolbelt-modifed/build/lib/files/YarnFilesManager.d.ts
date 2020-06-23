import { YarnSymlinkedModulesConfig } from './YarnLinkedFilesConfig';
export declare class YarnFilesManager {
    private linkConfig;
    private static readonly LINKED_YARN_MODULES_IGNORED_FILES;
    private static readonly BUILDER_HUB_LINKED_DEPS_DIR;
    private static readonly BUILDER_HUB_LINKED_DEPS_CONFIG_PATH;
    static createFilesManager(projectSrc: string): Promise<YarnFilesManager>;
    private static getFiles;
    constructor(linkConfig: YarnSymlinkedModulesConfig);
    get symlinkedDepsDirs(): string[];
    get yarnLinkedDependencies(): {
        moduleName: string;
        path: string;
    }[];
    getYarnLinkedFiles(): Promise<BatchStream[]>;
    logSymlinkedDependencies(): void;
    maybeMapLocalYarnLinkedPathToProjectPath: (path: string, projectPath: string) => string;
}
