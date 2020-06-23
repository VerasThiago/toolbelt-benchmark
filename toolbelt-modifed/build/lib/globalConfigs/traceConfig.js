"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
class TraceConfig {
    static setShouldTrace() {
        this.traceFlag = true;
        this.jaegerDebugID = `toolbelt-${crypto_1.randomBytes(8).toString('hex')}`;
        logger_1.default.info(`Trace Debug ID: ${this.jaegerDebugID}`);
    }
    static setupTraceConfig(traceFlag) {
        if (traceFlag) {
            this.setShouldTrace();
        }
    }
    static shouldTrace() {
        return this.traceFlag;
    }
}
exports.TraceConfig = TraceConfig;
TraceConfig.traceFlag = false;
