import { IOutdatedCheckerStore } from './OutdatedCheckerStore';
export declare class OutdatedChecker {
    private store;
    private pkg;
    private static readonly OUTDATED_CHECK_INTERVAL;
    private static readonly OUTDATED_CHECKER_STORE_FILENAME;
    private static singleton;
    static checkForOutdate(storeDir: string, pkgJson: any): void;
    private outdatedInfo;
    constructor(store: IOutdatedCheckerStore, pkg: any);
    shouldCheckOutdated(): boolean;
    startCheckerProcess(): void;
    isOutdated(): boolean;
}
