"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const configstore_1 = tslib_1.__importDefault(require("configstore"));
const path_1 = require("path");
const package_json_1 = require("../package.json");
const conf = new configstore_1.default(package_json_1.name);
exports.configDir = path_1.dirname(conf.path);
var Environment;
(function (Environment) {
    Environment["Production"] = "prod";
})(Environment = exports.Environment || (exports.Environment = {}));
exports.CLUSTER_DEFAULT_VALUE = '';
exports.ENV_DEFAULT_VALUE = Environment.Production;
exports.saveEnvironment = (env) => conf.set('env', env);
exports.saveStickyHost = (appName, stickyHost) => conf.set(`apps.${appName}.sticky-host`, { stickyHost, lastUpdated: Date.now() });
exports.getStickyHost = (appName) => conf.get(`apps.${appName}.sticky-host`);
exports.hasStickyHost = (appName) => conf.has(`apps.${appName}.sticky-host`);
exports.getNextFeedbackDate = () => conf.get('_nextFeedbackDate');
exports.saveNextFeedbackDate = (date) => conf.set('_nextFeedbackDate', date);
const envFromProcessEnv = {
    prod: Environment.Production,
};
exports.getEnvironment = () => {
    const env = envFromProcessEnv[process.env.VTEX_ENV];
    const persisted = conf.get('env') || exports.ENV_DEFAULT_VALUE;
    return env || persisted;
};
var Region;
(function (Region) {
    Region["Production"] = "aws-us-east-1";
})(Region = exports.Region || (exports.Region = {}));
exports.saveCluster = (cluster) => {
    conf.set('cluster', cluster);
};
exports.getCluster = () => {
    return conf.get('cluster') || exports.CLUSTER_DEFAULT_VALUE;
};
