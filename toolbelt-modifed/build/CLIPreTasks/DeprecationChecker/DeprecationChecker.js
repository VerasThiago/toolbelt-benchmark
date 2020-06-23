"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const path_1 = require("path");
const spawnUnblockingChildProcess_1 = require("../../lib/utils/spawnUnblockingChildProcess");
const DeprecationCheckerStore_1 = require("./DeprecationCheckerStore");
class DeprecationChecker {
    constructor(store, pkg) {
        this.store = store;
        this.pkg = pkg;
        this.deprecationInfo = store.getVersionDeprecationInfo();
    }
    static checkForDeprecation(storeDir, pkgJson) {
        if (!DeprecationChecker.singleton) {
            const store = new DeprecationCheckerStore_1.DeprecationCheckerStore(path_1.join(storeDir, DeprecationChecker.DEPRECATION_CHECKER_STORE_FILENAME));
            DeprecationChecker.singleton = new DeprecationChecker(store, pkgJson);
        }
        const checker = DeprecationChecker.singleton;
        if (checker.shouldCheckNpm()) {
            checker.startCheckerProcess();
        }
        if (!checker.isDeprecated()) {
            return;
        }
        const errMsg = chalk_1.default.bold(`This version ${pkgJson.version} was deprecated. Please update to the latest version: ${chalk_1.default.green('yarn global add vtex')}.`);
        console.error(errMsg);
        process.exit(1);
    }
    shouldCheckNpm() {
        return (this.deprecationInfo.versionChecked !== this.pkg.version ||
            Date.now() - this.store.getLastDeprecationCheck() >= DeprecationChecker.DEPRECATION_CHECK_INTERVAL);
    }
    startCheckerProcess() {
        spawnUnblockingChildProcess_1.spawnUnblockingChildProcess(process.execPath, [
            path_1.join(__dirname, 'checkForDeprecate.js'),
            this.store.storeFilePath,
            this.pkg.name,
            this.pkg.version,
        ]);
    }
    isDeprecated() {
        if (this.deprecationInfo.versionChecked === this.pkg.version && this.deprecationInfo.deprecated) {
            return true;
        }
        return false;
    }
}
exports.DeprecationChecker = DeprecationChecker;
DeprecationChecker.DEPRECATION_CHECK_INTERVAL = 1 * 3600 * 1000;
DeprecationChecker.DEPRECATION_CHECKER_STORE_FILENAME = 'deprecation-checking.json';
