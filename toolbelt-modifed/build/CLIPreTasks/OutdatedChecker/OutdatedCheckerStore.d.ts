export interface OutdatedInfo {
    versionChecked: string;
    outdated: boolean;
}
export interface IOutdatedCheckerStore {
    storeFilePath: string;
    getLastOutdatedCheck: () => number;
    setLastOutdatedCheck: (date: number) => void;
    getOutdatedInfo: () => OutdatedInfo;
    setOutdatedInfo: (info: OutdatedInfo) => void;
}
export declare class OutdatedCheckerStore implements IOutdatedCheckerStore {
    storeFilePath: string;
    private store;
    constructor(storeFilePath: string);
    getLastOutdatedCheck(): number;
    getOutdatedInfo(): OutdatedInfo;
    setLastOutdatedCheck(date: number): void;
    setOutdatedInfo(versionOutdatedInfo: OutdatedInfo): void;
}
