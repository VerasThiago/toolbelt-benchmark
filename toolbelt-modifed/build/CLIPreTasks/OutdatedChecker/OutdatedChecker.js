"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const path_1 = require("path");
const spawnUnblockingChildProcess_1 = require("../../lib/utils/spawnUnblockingChildProcess");
const OutdatedCheckerStore_1 = require("./OutdatedCheckerStore");
class OutdatedChecker {
    constructor(store, pkg) {
        this.store = store;
        this.pkg = pkg;
        this.outdatedInfo = store.getOutdatedInfo();
    }
    static checkForOutdate(storeDir, pkgJson) {
        if (!OutdatedChecker.singleton) {
            const store = new OutdatedCheckerStore_1.OutdatedCheckerStore(path_1.join(storeDir, OutdatedChecker.OUTDATED_CHECKER_STORE_FILENAME));
            OutdatedChecker.singleton = new OutdatedChecker(store, pkgJson);
        }
        const checker = OutdatedChecker.singleton;
        if (checker.shouldCheckOutdated()) {
            checker.startCheckerProcess();
        }
        if (!checker.isOutdated()) {
            return;
        }
        const errMsg = chalk_1.default.bold(`This version ${pkgJson.version} is outdated. Please update to the latest version: ${chalk_1.default.green('yarn global add vtex')}.`);
        console.error(errMsg);
        process.exit(1);
    }
    shouldCheckOutdated() {
        return (this.outdatedInfo.outdated ||
            this.outdatedInfo.versionChecked !== this.pkg.version ||
            Date.now() - this.store.getLastOutdatedCheck() >= OutdatedChecker.OUTDATED_CHECK_INTERVAL);
    }
    startCheckerProcess() {
        spawnUnblockingChildProcess_1.spawnUnblockingChildProcess(process.execPath, [
            path_1.join(__dirname, 'checkForOutdated.js'),
            this.store.storeFilePath,
            this.pkg.version,
        ]);
    }
    isOutdated() {
        if (this.outdatedInfo.versionChecked === this.pkg.version && this.outdatedInfo.outdated) {
            return true;
        }
        return false;
    }
}
exports.OutdatedChecker = OutdatedChecker;
OutdatedChecker.OUTDATED_CHECK_INTERVAL = 1 * 3600 * 1000;
OutdatedChecker.OUTDATED_CHECKER_STORE_FILENAME = 'outdated-checking.json';
