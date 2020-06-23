"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Apps_1 = require("../../lib/clients/IOClients/infra/Apps");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const utils_1 = require("./utils");
const { getDependencies } = Apps_1.createAppsClient();
exports.default = async (flags) => {
    logger_1.default.debug('Starting to list dependencies');
    const deps = await getDependencies();
    const keysOnly = flags.keys;
    if (!flags.npm) {
        utils_1.removeNpm(deps, !keysOnly);
    }
    const result = keysOnly ? Object.keys(deps) : deps;
    console.log(JSON.stringify(result, null, 2));
};
