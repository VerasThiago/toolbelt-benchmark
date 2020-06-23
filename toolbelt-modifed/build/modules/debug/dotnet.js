"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Runtime_1 = require("../../lib/clients/IOClients/infra/Runtime");
const manifest_1 = require("../../lib/manifest");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
exports.default = async (debugInst) => {
    const manifest = await manifest_1.ManifestEditor.getManifestEditor();
    const { name, vendor, builders } = manifest;
    if (!(builders === null || builders === void 0 ? void 0 : builders.dotnet)) {
        logger_1.default.error('This command can only be used for dotnet apps');
        return;
    }
    const runtimeClient = Runtime_1.Runtime.createClient();
    await runtimeClient.debugDotnetApp(name, vendor, manifest.major, debugInst);
};
