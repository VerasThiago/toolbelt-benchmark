"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const configstore_1 = tslib_1.__importDefault(require("configstore"));
const MetricReport_1 = require("../metrics/MetricReport");
class TelemetryLocalStore {
    constructor(storeFilePath) {
        this.storeFilePath = storeFilePath;
        this.store = new configstore_1.default('', null, { configPath: storeFilePath });
    }
    getErrors() {
        return this.store.get('errors') || [];
    }
    getMetrics() {
        const metrics = this.store.get('metrics');
        if (!Array.isArray(metrics)) {
            return [];
        }
        return metrics.map(metric => MetricReport_1.MetricReport.create(metric.metric, metric.env));
    }
    getLastRemoteFlush() {
        var _a;
        return (_a = this.store.get('lastRemoteFlush')) !== null && _a !== void 0 ? _a : 0;
    }
    setErrors(errors) {
        this.store.set('errors', errors);
    }
    setMetrics(metrics) {
        this.store.set('metrics', metrics);
    }
    setLastRemoteFlush(date) {
        this.store.set('lastRemoteFlush', date);
    }
    clear() {
        this.store.clear();
    }
}
exports.TelemetryLocalStore = TelemetryLocalStore;
