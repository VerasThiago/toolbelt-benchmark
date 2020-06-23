"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = require("ramda");
const errors_1 = require("../../errors");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const conf_1 = require("../../conf");
const envValues = ramda_1.values(conf_1.Environment);
exports.default = (name, value) => {
    switch (name) {
        case 'env':
            if (!ramda_1.contains(value, envValues)) {
                throw new errors_1.CommandError(`Invalid value for environment "${value}". Possible values are: ${envValues.join(', ')}`);
            }
            conf_1.saveEnvironment(value);
            logger_1.default.info(`Successfully set environment to "${value}"`);
            break;
        case 'cluster':
            conf_1.saveCluster(value);
            logger_1.default.info(`Successfully set cluster to "${value}"`);
            break;
        default:
            throw new errors_1.CommandError(`The supported configurations are: ${chalk_1.default.blue('env')}, ${chalk_1.default.blue('cluster')}`);
    }
};
