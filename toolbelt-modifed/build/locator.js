"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionMajor = (version) => {
    return version.split('.', 2)[0];
};
exports.toMajorRange = (version) => {
    return `${exports.versionMajor(version)}.x`;
};
exports.toAppLocator = ({ vendor, name, version }) => {
    return `${vendor}.${name}@${version}`;
};
exports.parseLocator = (locator) => {
    const [vendorAndName, version] = locator.split('@');
    const [vendor, name] = vendorAndName.split('.');
    return { vendor, name, version, builders: {} };
};
exports.removeVersion = (appId) => appId.split('@', 2)[0];
