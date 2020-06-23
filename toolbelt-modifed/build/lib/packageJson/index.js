"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lockfile_1 = require("@yarnpkg/lockfile");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const semver_1 = tslib_1.__importDefault(require("semver"));
const isRangeVersion = (version) => {
    return semver_1.default.validRange(version) && !semver_1.default.valid(version);
};
class PackageJson {
    constructor(packageJsonPath, notifier) {
        this.packageJsonPath = packageJsonPath;
        this.notifier = notifier;
    }
    static versionSatisfiesWithYarnPriority(versionRequired, versionFound, yarnResolvedVersion) {
        if (!semver_1.default.valid(versionFound) && !semver_1.default.validRange(versionFound)) {
            return false;
        }
        if (!yarnResolvedVersion) {
            return versionRequired === versionFound;
        }
        if (isRangeVersion(versionRequired)) {
            if (isRangeVersion(versionFound)) {
                return semver_1.default.satisfies(yarnResolvedVersion, versionRequired);
            }
            return semver_1.default.satisfies(versionFound, versionRequired);
        }
        return versionRequired === versionFound;
    }
    static async getBuilderPackageJsonIfExists(appRoot, builder, notifyIfDoesntExist, notifier) {
        const path = path_1.resolve(appRoot, builder, 'package.json');
        if (!(await fs_extra_1.pathExists(path))) {
            if (notifyIfDoesntExist) {
                notifier.warn(`Folder ${builder} doesn't have a package.json`);
            }
            return null;
        }
        const pkg = new PackageJson(path, notifier);
        await pkg.init();
        return pkg;
    }
    static async readAndParseYarnLock(yarnLockPath) {
        const content = await fs_extra_1.readFile(yarnLockPath, 'utf8');
        return lockfile_1.parse(content);
    }
    async init() {
        this.content = await fs_extra_1.readJson(this.packageJsonPath);
        const yarnLockPath = path_1.join(path_1.dirname(this.packageJsonPath), 'yarn.lock');
        if (await fs_extra_1.pathExists(yarnLockPath)) {
            this.yarnLock = await PackageJson.readAndParseYarnLock(yarnLockPath);
        }
    }
    get name() {
        var _a;
        return (_a = this.content.name) !== null && _a !== void 0 ? _a : '';
    }
    get version() {
        var _a;
        return (_a = this.content.version) !== null && _a !== void 0 ? _a : '';
    }
    get dependencies() {
        var _a;
        return (_a = this.content.dependencies) !== null && _a !== void 0 ? _a : {};
    }
    get devDependencies() {
        var _a;
        return (_a = this.content.devDependencies) !== null && _a !== void 0 ? _a : {};
    }
    getYarnResolvedVersion(depType, depName) {
        var _a, _b, _c;
        const depVersionLocator = this.content[depType][depName];
        const yarnDepLocator = `${depName}@${depVersionLocator}`;
        return (_c = (_b = (_a = this.yarnLock) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b[yarnDepLocator]) === null || _c === void 0 ? void 0 : _c.version;
    }
    flushChanges() {
        return fs_extra_1.writeJson(this.packageJsonPath, this.content, { spaces: 2 });
    }
    flushChangesSync() {
        return fs_extra_1.writeJsonSync(this.packageJsonPath, this.content, { spaces: 2 });
    }
    changeDepVersionIfUnsatisfied(depName, depVersion) {
        this.maybeChangeDepVersionByDepType(depName, depVersion, 'dependencies');
        this.maybeChangeDepVersionByDepType(depName, depVersion, 'devDependencies');
    }
    maybeChangeDepVersionByDepType(depName, depVersion, depType) {
        var _a, _b;
        if (((_a = this.content[depType]) === null || _a === void 0 ? void 0 : _a[depName]) != null &&
            !PackageJson.versionSatisfiesWithYarnPriority(depVersion, this.content[depType][depName], this.getYarnResolvedVersion(depType, depName))) {
            (_b = this.notifier) === null || _b === void 0 ? void 0 : _b.warn(`Changing ${depName} on ${depType} from ${this.content[depType][depName]} to ${depVersion}`);
            this.content[depType][depName] = depVersion;
        }
    }
    addDependency(depName, depVersionOrUrl, depType) {
        this.content[depType] = {
            ...this.content[depType],
            [depName]: depVersionOrUrl,
        };
    }
}
exports.PackageJson = PackageJson;
