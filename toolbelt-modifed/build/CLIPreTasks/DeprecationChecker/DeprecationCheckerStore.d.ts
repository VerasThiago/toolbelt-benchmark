export interface VersionDeprecationInfo {
    versionChecked: string;
    deprecated: boolean;
}
export interface IDeprecationCheckerStore {
    storeFilePath: string;
    getLastDeprecationCheck: () => number;
    setLastDeprecationCheck: (date: number) => void;
    getVersionDeprecationInfo: () => VersionDeprecationInfo;
    setVersionDeprecationInfo: (info: VersionDeprecationInfo) => void;
}
export declare class DeprecationCheckerStore implements IDeprecationCheckerStore {
    storeFilePath: string;
    private store;
    constructor(storeFilePath: string);
    getLastDeprecationCheck(): number;
    getVersionDeprecationInfo(): VersionDeprecationInfo;
    setLastDeprecationCheck(date: number): void;
    setVersionDeprecationInfo(versionDeprecationInfo: VersionDeprecationInfo): void;
}
