"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const errors_1 = require("../../errors");
const manifest_1 = require("../../manifest");
const ManifestValidator_1 = require("./ManifestValidator");
class ManifestEditor {
    constructor(path = ManifestEditor.manifestPath) {
        this.path = path;
    }
    static get manifestPath() {
        return path_1.resolve(manifest_1.getAppRoot(), this.MANIFEST_FILE_NAME);
    }
    static async getManifestEditor(path = ManifestEditor.manifestPath) {
        const manifest = new ManifestEditor(path);
        await manifest.init();
        return manifest;
    }
    static async isManifestReadable() {
        try {
            await this.readAndParseManifest(this.manifestPath);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    static readAndParseManifest(path) {
        try {
            return fs_extra_1.readJson(path);
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                throw new Error(`Missing manifest.json on app root. ${e}`);
            }
            throw new errors_1.CommandError(`Malformed manifest.json file. ${e}`);
        }
    }
    async init() {
        this.manifest = await ManifestEditor.readAndParseManifest(this.path);
        ManifestValidator_1.ManifestValidator.validate(this.manifest);
    }
    get name() {
        return this.manifest.name;
    }
    get version() {
        return this.manifest.version;
    }
    get vendor() {
        return this.manifest.vendor;
    }
    get dependencies() {
        return this.manifest.dependencies;
    }
    get builders() {
        return this.manifest.builders;
    }
    get builderNames() {
        return Object.keys(this.manifest.builders);
    }
    get appLocator() {
        const { vendor, name, version } = this.manifest;
        return `${vendor}.${name}@${version}`;
    }
    get major() {
        return this.manifest.version.split('.', 2)[0];
    }
    get majorRange() {
        return `${this.major}.x`;
    }
    flushChangesSync() {
        return fs_extra_1.writeJsonSync(this.path, this.manifest, { spaces: 2 });
    }
    flushChanges() {
        return fs_extra_1.writeJson(this.path, this.manifest, { spaces: 2 });
    }
    async writeSchema() {
        if (this.manifest.$schema !== ManifestEditor.MANIFEST_SCHEMA) {
            this.manifest.$schema = ManifestEditor.MANIFEST_SCHEMA;
        }
        return this.flushChanges();
    }
    addDependency(app, version) {
        this.manifest.dependencies = {
            ...this.manifest.dependencies,
            [app]: version,
        };
        return this.flushChanges();
    }
}
exports.ManifestEditor = ManifestEditor;
ManifestEditor.MANIFEST_FILE_NAME = 'manifest.json';
ManifestEditor.MANIFEST_SCHEMA = 'https://raw.githubusercontent.com/vtex/node-vtex-api/master/gen/manifest.schema';
