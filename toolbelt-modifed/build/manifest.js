"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const path_1 = tslib_1.__importDefault(require("path"));
const ramda_1 = require("ramda");
const errors_1 = require("./errors");
const readFileUtf = (file) => {
    return fs_extra_1.readFile(file, 'utf8');
};
const MANIFEST_SCHEMA = 'https://raw.githubusercontent.com/vtex/node-vtex-api/master/gen/manifest.schema';
exports.MANIFEST_FILE_NAME = 'manifest.json';
exports.getAppRoot = () => {
    if (process.env.OCLIF_COMPILATION) {
        return '';
    }
    const cwd = process.cwd();
    const { root: rootDirName } = path_1.default.parse(cwd);
    const find = dir => {
        try {
            fs_1.accessSync(path_1.default.join(dir, exports.MANIFEST_FILE_NAME));
            return dir;
        }
        catch (e) {
            if (dir === rootDirName) {
                throw new errors_1.CommandError("Manifest file doesn't exist or is not readable. Please make sure you're in the app's directory or add a manifest.json file in the root folder of the app.");
            }
            return find(path_1.default.resolve(dir, '..'));
        }
    };
    return find(cwd);
};
exports.namePattern = '[\\w_-]+';
exports.vendorPattern = '[\\w_-]+';
exports.versionPattern = '\\d+\\.\\d+\\.\\d+(-.*)?';
exports.wildVersionPattern = '\\d+\\.((\\d+\\.\\d+)|(\\d+\\.x)|x)(-.*)?';
exports.getManifestPath = () => path_1.default.resolve(exports.getAppRoot(), exports.MANIFEST_FILE_NAME);
exports.parseManifest = (content) => {
    try {
        return JSON.parse(content);
    }
    catch (e) {
        throw new errors_1.CommandError(`Malformed manifest.json file. ${e}`);
    }
};
exports.validateAppManifest = (manifest) => {
    const vendorRegex = new RegExp(`^${exports.vendorPattern}$`);
    const nameRegex = new RegExp(`^${exports.namePattern}$`);
    const versionRegex = new RegExp(`^${exports.versionPattern}$`);
    if (manifest.name === undefined) {
        throw new errors_1.CommandError("Field 'name' should be set in manifest.json file");
    }
    if (manifest.version === undefined) {
        throw new errors_1.CommandError("Field 'version' should be set in manifest.json file");
    }
    if (manifest.vendor === undefined) {
        throw new errors_1.CommandError("Field 'vendor' should be set in manifest.json file");
    }
    if (!nameRegex.test(manifest.name)) {
        throw new errors_1.CommandError("Field 'name' may contain only letters, numbers, underscores and hyphens");
    }
    if (!vendorRegex.test(manifest.vendor)) {
        throw new errors_1.CommandError("Field 'vendor' may contain only letters, numbers, underscores and hyphens");
    }
    if (!versionRegex.test(manifest.version)) {
        throw new errors_1.CommandError('The version format is invalid');
    }
};
exports.getManifest = ramda_1.memoize(async () => {
    const manifest = exports.parseManifest(await readFileUtf(exports.getManifestPath()));
    exports.validateAppManifest(manifest);
    return manifest;
});
exports.writeManifestSchema = async () => {
    const content = await readFileUtf(exports.getManifestPath());
    const json = JSON.parse(content);
    if (!json.$schema || json.$schema !== MANIFEST_SCHEMA) {
        json.$schema = MANIFEST_SCHEMA;
        fs_extra_1.writeFile(exports.getManifestPath(), JSON.stringify(json, null, 2));
    }
};
