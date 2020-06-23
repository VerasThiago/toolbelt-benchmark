"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pkg = tslib_1.__importStar(require("../../../package.json"));
const SessionManager_1 = require("../session/SessionManager");
const getPlatform_1 = require("../utils/getPlatform");
class MetricReport {
    constructor({ metric, env }) {
        this.metric = metric;
        this.env = env;
    }
    static create(metric, env) {
        if (env) {
            return new MetricReport({ metric, env });
        }
        const { workspace, account } = SessionManager_1.SessionManager.getSingleton();
        return new MetricReport({
            metric,
            env: {
                account,
                workspace,
                toolbeltVersion: pkg.version,
                nodeVersion: process.version,
                platform: getPlatform_1.getPlatform(),
            },
        });
    }
    addMetric(metricName, value) {
        this.metric[metricName] = value;
    }
    addMetrics(metrics) {
        Object.entries(metrics).forEach(([metricName, metricValue]) => {
            this.metric[metricName] = metricValue;
        });
    }
    toObject() {
        return {
            metric: this.metric,
            env: this.env,
        };
    }
}
exports.MetricReport = MetricReport;
