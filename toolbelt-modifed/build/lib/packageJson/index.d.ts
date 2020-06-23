import { parse as parseYarnLock } from '@yarnpkg/lockfile';
export interface PackageJsonInterface {
    name?: string;
    version?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}
export declare class PackageJson {
    packageJsonPath: string;
    private notifier?;
    static versionSatisfiesWithYarnPriority(versionRequired: string, versionFound: string, yarnResolvedVersion: string): any;
    static getBuilderPackageJsonIfExists(appRoot: string, builder: string, notifyIfDoesntExist: boolean, notifier?: any): Promise<PackageJson | null>;
    private static readAndParseYarnLock;
    content: PackageJsonInterface;
    yarnLock: ReturnType<typeof parseYarnLock>;
    constructor(packageJsonPath: string, notifier?: any);
    init(): Promise<void>;
    get name(): string;
    get version(): string;
    get dependencies(): Record<string, string>;
    get devDependencies(): Record<string, string>;
    private getYarnResolvedVersion;
    flushChanges(): Promise<void>;
    flushChangesSync(): void;
    changeDepVersionIfUnsatisfied(depName: string, depVersion: string): void;
    maybeChangeDepVersionByDepType(depName: string, depVersion: string, depType: 'dependencies' | 'devDependencies'): void;
    addDependency(depName: string, depVersionOrUrl: string, depType: 'dependencies' | 'devDependencies'): void;
}
