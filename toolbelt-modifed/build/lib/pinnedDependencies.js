"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("../logger"));
const manifest_1 = require("../manifest");
const packageJson_1 = require("./packageJson");
exports.fixBuilderFolderPinnedDeps = async (appRoot, builder, builderPinnedDeps) => {
    const pkgJson = await packageJson_1.PackageJson.getBuilderPackageJsonIfExists(appRoot, builder, true, logger_1.default);
    if (!pkgJson) {
        return;
    }
    const depNames = Object.keys(builderPinnedDeps);
    depNames.forEach(depName => {
        const depVersion = builderPinnedDeps[depName];
        pkgJson.changeDepVersionIfUnsatisfied(depName, depVersion);
    });
    await pkgJson.flushChanges();
};
exports.fixPinnedDependencies = async (pinnedDeps, buildersToFixDeps, manifestBuilders) => {
    const appRoot = manifest_1.getAppRoot();
    await Promise.all(buildersToFixDeps.map((builder) => {
        var _a;
        const builderMajorLocator = manifestBuilders[builder];
        if (!builderMajorLocator) {
            return Promise.resolve();
        }
        const pinnedDepsForBuilder = {
            ...(_a = pinnedDeps.builders[builder]) === null || _a === void 0 ? void 0 : _a[builderMajorLocator],
            ...pinnedDeps.common,
        };
        return exports.fixBuilderFolderPinnedDeps(appRoot, builder, pinnedDepsForBuilder);
    }));
};
