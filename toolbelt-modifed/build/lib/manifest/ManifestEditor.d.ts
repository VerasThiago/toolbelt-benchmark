export declare class ManifestEditor {
    path: string;
    static readonly MANIFEST_FILE_NAME = "manifest.json";
    static readonly MANIFEST_SCHEMA = "https://raw.githubusercontent.com/vtex/node-vtex-api/master/gen/manifest.schema";
    static get manifestPath(): string;
    static getManifestEditor(path?: string): Promise<ManifestEditor>;
    static isManifestReadable(): Promise<boolean>;
    static readAndParseManifest(path: string): Promise<any>;
    manifest: Manifest;
    constructor(path?: string);
    init(): Promise<void>;
    get name(): string;
    get version(): string;
    get vendor(): string;
    get dependencies(): {
        [name: string]: string;
    };
    get builders(): {
        [name: string]: string;
    };
    get builderNames(): string[];
    get appLocator(): string;
    get major(): string;
    get majorRange(): string;
    flushChangesSync(): void;
    flushChanges(): Promise<void>;
    writeSchema(): Promise<void>;
    addDependency(app: string, version: string): Promise<void>;
}
