"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const namePattern = '[\\w_-]+';
const vendorPattern = '[\\w_-]+';
const versionPattern = '\\d+\\.\\d+\\.\\d+(-.*)?';
const wildVersionPattern = '\\d+\\.((\\d+\\.\\d+)|(\\d+\\.x)|x)(-.*)?';
const majorVersionLocatorPattern = '\\d+\\.((\\d+\\.\\d+)|(\\d+\\.x)|x)(-.*)?';
const appID = new RegExp(`^${vendorPattern}\\.${namePattern}$`);
const dependencyName = new RegExp(`^(${vendorPattern}\\.|(infra):)${namePattern}(@${wildVersionPattern})?$`);
const appLocator = new RegExp(`^${vendorPattern}\\.${namePattern}(?:@${wildVersionPattern})?$`);
class ManifestValidator {
    static validate(manifest) {
        const vendorRegex = new RegExp(`^${this.vendorPattern}$`);
        const nameRegex = new RegExp(`^${this.namePattern}$`);
        const versionRegex = new RegExp(`^${this.versionPattern}$`);
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
    }
    static validateApp(app, skipVersion = false) {
        const regex = skipVersion ? ManifestValidator.appID : ManifestValidator.appLocator;
        if (!regex.test(app)) {
            throw new errors_1.CommandError(`Invalid app format, please use <vendor>.<name>${skipVersion ? '' : '[@<version>]'}`);
        }
        return app;
    }
}
exports.ManifestValidator = ManifestValidator;
ManifestValidator.namePattern = namePattern;
ManifestValidator.vendorPattern = vendorPattern;
ManifestValidator.versionPattern = versionPattern;
ManifestValidator.wildVersionPattern = wildVersionPattern;
ManifestValidator.majorVersionLocatorPattern = majorVersionLocatorPattern;
ManifestValidator.appID = appID;
ManifestValidator.dependencyName = dependencyName;
ManifestValidator.appLocator = appLocator;
