"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const errors_1 = require("../../errors");
const conf_1 = require("../../conf");
exports.default = (name) => {
    switch (name) {
        case 'env':
            conf_1.saveEnvironment(conf_1.ENV_DEFAULT_VALUE);
            break;
        case 'cluster':
            conf_1.saveCluster(conf_1.CLUSTER_DEFAULT_VALUE);
            break;
        default:
            throw new errors_1.CommandError(`The supported configurations are: ${chalk_1.default.blue('env')}, ${chalk_1.default.blue('cluster')}`);
    }
};
