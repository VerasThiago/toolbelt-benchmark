"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const configstore_1 = tslib_1.__importDefault(require("configstore"));
class OutdatedCheckerStore {
    constructor(storeFilePath) {
        this.storeFilePath = storeFilePath;
        this.store = new configstore_1.default('', null, { configPath: storeFilePath });
    }
    getLastOutdatedCheck() {
        var _a;
        return (_a = this.store.get('lastOutdatedCheck')) !== null && _a !== void 0 ? _a : 0;
    }
    getOutdatedInfo() {
        var _a;
        return (_a = this.store.get('outdatedInfo')) !== null && _a !== void 0 ? _a : { versionChecked: '', outdated: false };
    }
    setLastOutdatedCheck(date) {
        this.store.set('lastOutdatedCheck', date);
    }
    setOutdatedInfo(versionOutdatedInfo) {
        this.store.set('outdatedInfo', versionOutdatedInfo);
    }
}
exports.OutdatedCheckerStore = OutdatedCheckerStore;
