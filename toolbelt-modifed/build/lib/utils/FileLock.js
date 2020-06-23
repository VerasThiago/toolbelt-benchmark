"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const lockfile = tslib_1.__importStar(require("proper-lockfile"));
class FileLock {
    constructor(lockPath) {
        this.lockPath = lockPath;
        this.lockName = path_1.basename(lockPath);
        this.lockDir = path_1.dirname(this.lockPath);
        this.locked = false;
    }
    async lock() {
        if (this.locked) {
            return;
        }
        await fs_extra_1.ensureDir(this.lockDir);
        this.releaseLock = await lockfile.lock(this.lockDir, {
            stale: FileLock.LOCK_STALE_TIME,
            lockfilePath: this.lockPath,
        });
        this.locked = true;
    }
    unlock() {
        var _a;
        if (!this.locked) {
            return;
        }
        this.locked = false;
        return (_a = this.releaseLock) === null || _a === void 0 ? void 0 : _a.call(this);
    }
}
exports.FileLock = FileLock;
FileLock.LOCK_STALE_TIME = 5 * 60 * 1000;
