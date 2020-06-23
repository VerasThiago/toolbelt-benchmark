"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
const stream_1 = require("stream");
const axios_1 = tslib_1.__importDefault(require("axios"));
const tar_1 = tslib_1.__importDefault(require("tar"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const FileReaderWriter_1 = require("./includes/FileReaderWriter");
const SessionManager_1 = require("../../lib/session/SessionManager");
exports.packageJsonEditor = new FileReaderWriter_1.FileReaderWriter('packageJson');
exports.eslintrcEditor = new FileReaderWriter_1.FileReaderWriter('eslintrc');
exports.tsconfigEditor = new FileReaderWriter_1.FileReaderWriter('tsconfig');
exports.eslintIgnoreEditor = new FileReaderWriter_1.FileReaderWriter('eslintIgnore', false);
exports.prettierrcEditor = new FileReaderWriter_1.FileReaderWriter('prettierrc');
exports.checkIfTarGzIsEmpty = (url) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios_1.default.get(url, {
                responseType: 'stream',
                headers: { Authorization: SessionManager_1.SessionManager.getSingleton().token },
            });
            let fileCount = 0;
            const fileEmitter = tar_1.default.list();
            fileEmitter.on('entry', () => (fileCount += 1));
            await util_1.default.promisify(stream_1.pipeline)([res.data, fileEmitter]);
            resolve(fileCount === 0);
        }
        catch (err) {
            reject(err);
        }
    });
};
/**
 * Reads and parses the root package.json file
 *
 * @export
 * @returns The package.json object
 */
function getRootPackageJson() {
    try {
        return exports.packageJsonEditor.read('.');
    }
    catch (err) {
        if (err.code !== 'ENOENT') {
            logger_1.default.error(err);
        }
    }
    return null;
}
exports.getRootPackageJson = getRootPackageJson;
/**
 * Checks if every dev dependency of a dependency map is installed in a package.json
 * @param {{ deps: Record<string, string>; pkg: PackageJSON }} { deps, pkg }
 * @returns {boolean}
 */
function hasDevDependenciesInstalled({ deps, pkg }) {
    return Object.keys(deps).every(p => p in pkg.devDependencies);
}
exports.hasDevDependenciesInstalled = hasDevDependenciesInstalled;
/**
 * Sort the given object. Useful for sorting the `package.json` dependencies
 */
function sortObject(obj) {
    return Object.keys(obj)
        .sort((strA, strB) => strA.localeCompare(strB))
        .reduce((sortedObject, key) => ({ ...sortedObject, [key]: obj[key] }), {});
}
exports.sortObject = sortObject;
