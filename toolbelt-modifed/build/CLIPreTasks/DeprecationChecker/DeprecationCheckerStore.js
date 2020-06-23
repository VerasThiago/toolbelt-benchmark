"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const configstore_1 = tslib_1.__importDefault(require("configstore"));
class DeprecationCheckerStore {
    constructor(storeFilePath) {
        this.storeFilePath = storeFilePath;
        this.store = new configstore_1.default('', null, { configPath: storeFilePath });
    }
    getLastDeprecationCheck() {
        var _a;
        return (_a = this.store.get('lastDeprecationCheck')) !== null && _a !== void 0 ? _a : 0;
    }
    getVersionDeprecationInfo() {
        var _a;
        return ((_a = this.store.get('versionDeprecationInfo')) !== null && _a !== void 0 ? _a : {
            versionChecked: '',
            deprecated: true,
        });
    }
    setLastDeprecationCheck(date) {
        this.store.set('lastDeprecationCheck', date);
    }
    setVersionDeprecationInfo(versionDeprecationInfo) {
        this.store.set('versionDeprecationInfo', versionDeprecationInfo);
    }
}
exports.DeprecationCheckerStore = DeprecationCheckerStore;
