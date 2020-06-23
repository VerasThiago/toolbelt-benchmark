"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const IOClientFactory_1 = require("../IOClientFactory");
class ToolbeltTelemetry extends api_1.AppClient {
    static createClient(customContext = {}, customOptions = {}) {
        return IOClientFactory_1.IOClientFactory.createClient(ToolbeltTelemetry, customContext, customOptions);
    }
    constructor(ioContext, opts) {
        super('vtex.toolbelt-telemetry@0.x', ioContext, opts);
    }
    reportErrors(errors) {
        const errorsBuffer = Buffer.from(JSON.stringify(errors));
        return this.http.post('/errorReport', errorsBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });
    }
    reportMetrics(metrics) {
        return this.http.post('/metricsRegister', metrics);
    }
}
exports.ToolbeltTelemetry = ToolbeltTelemetry;
