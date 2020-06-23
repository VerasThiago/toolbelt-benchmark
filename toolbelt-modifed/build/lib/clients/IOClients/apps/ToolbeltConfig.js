"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const IOClientFactory_1 = require("../IOClientFactory");
class ToolbeltConfig extends api_1.IOClient {
    constructor(context, options) {
        super(context, { ...options, baseURL: 'https://master--vtex.myvtex.com' });
    }
    static createClient(customContext = {}, customOptions = {}) {
        return IOClientFactory_1.IOClientFactory.createClient(ToolbeltConfig, customContext, {
            timeout: ToolbeltConfig.DEFAULT_TIMEOUT,
            ...customOptions,
        });
    }
    versionValidate(toolbeltVersion) {
        return this.http.post(ToolbeltConfig.VERSION_VALIDATE_PATH, { toolbeltVersion });
    }
    getGlobalConfig() {
        return this.http.get(ToolbeltConfig.GLOBAL_CONFIG_PATH);
    }
}
exports.ToolbeltConfig = ToolbeltConfig;
ToolbeltConfig.DEFAULT_TIMEOUT = 30000;
ToolbeltConfig.PUBLIC_PATH_PREFIX = '/_v/public/toolbelt';
ToolbeltConfig.GLOBAL_CONFIG_PATH = `${ToolbeltConfig.PUBLIC_PATH_PREFIX}/global-config`;
ToolbeltConfig.VERSION_VALIDATE_PATH = `${ToolbeltConfig.PUBLIC_PATH_PREFIX}/version-validate`;
