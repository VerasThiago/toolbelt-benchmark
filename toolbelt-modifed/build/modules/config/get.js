"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const errors_1 = require("../../errors");
const conf_1 = require("../../conf");
exports.default = (name) => {
    switch (name) {
        case 'env':
            console.log(conf_1.getEnvironment() || '');
            break;
        case 'cluster':
            console.log(conf_1.getCluster());
            break;
        default:
            throw new errors_1.CommandError(`The supported configurations are: ${chalk_1.default.blue('env')}, ${chalk_1.default.blue('cluster')}`);
    }
};
