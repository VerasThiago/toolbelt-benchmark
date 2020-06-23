import { IDeprecationCheckerStore } from './DeprecationCheckerStore';
export declare class DeprecationChecker {
    private store;
    private pkg;
    private static readonly DEPRECATION_CHECK_INTERVAL;
    private static readonly DEPRECATION_CHECKER_STORE_FILENAME;
    private static singleton;
    static checkForDeprecation(storeDir: string, pkgJson: any): void;
    private deprecationInfo;
    constructor(store: IDeprecationCheckerStore, pkg: any);
    shouldCheckNpm(): boolean;
    startCheckerProcess(): void;
    isDeprecated(): boolean;
}
