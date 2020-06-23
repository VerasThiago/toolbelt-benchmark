"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_error_report_1 = require("@vtex/node-error-report");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const pkg = tslib_1.__importStar(require("../../../package.json"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const SessionManager_1 = require("../session/SessionManager");
const getPlatform_1 = require("../utils/getPlatform");
const TelemetryCollector_1 = require("../telemetry/TelemetryCollector");
const errors_1 = require("../../errors");
class ErrorReport extends node_error_report_1.ErrorReportBase {
    constructor(args) {
        const { workspace, account } = SessionManager_1.SessionManager.getSingleton();
        const env = {
            account,
            workspace,
            toolbeltVersion: pkg.version,
            nodeVersion: process.version,
            platform: getPlatform_1.getPlatform(),
            command: process.argv.slice(2).join(' '),
        };
        super({
            ...args,
            details: {
                ...args.details,
                env,
            },
        });
        this.shouldRemoteReport = args.shouldRemoteReport;
    }
    static checkIfShouldRemoteReport(err) {
        if (err instanceof errors_1.CommandError) {
            return false;
        }
        return true;
    }
    static create(args) {
        var _a;
        return new ErrorReport({
            shouldRemoteReport: (_a = args.shouldRemoteReport) !== null && _a !== void 0 ? _a : ErrorReport.checkIfShouldRemoteReport(args.originalError),
            ...node_error_report_1.createErrorReportBaseArgs(args),
        });
    }
    static createAndMaybeRegisterOnTelemetry(args) {
        return ErrorReport.create(args).maybeSendToTelemetry();
    }
    logErrorForUser(opts) {
        var _a, _b, _c, _d;
        const { coreLogLevelDefault, requestDataLogLevelDefault } = {
            coreLogLevelDefault: (_a = opts === null || opts === void 0 ? void 0 : opts.coreLogLevelDefault) !== null && _a !== void 0 ? _a : 'error',
            requestDataLogLevelDefault: (_b = opts === null || opts === void 0 ? void 0 : opts.requestDataLogLevelDefault) !== null && _b !== void 0 ? _b : 'debug',
        };
        const coreLogLevels = {
            errorId: coreLogLevelDefault,
            errorKind: coreLogLevelDefault,
            errorMessage: coreLogLevelDefault,
            ...(_c = opts === null || opts === void 0 ? void 0 : opts.logLevels) === null || _c === void 0 ? void 0 : _c.core,
        };
        const requestDataLogLevels = {
            requestInfo: requestDataLogLevelDefault,
            requestStatus: requestDataLogLevelDefault,
            ...(_d = opts === null || opts === void 0 ? void 0 : opts.logLevels) === null || _d === void 0 ? void 0 : _d.requestData,
        };
        logger_1.default[coreLogLevels.errorKind](chalk_1.default `{bold ErrorKind:} ${this.kind}`);
        logger_1.default[coreLogLevels.errorMessage](chalk_1.default `{bold Message:} ${this.message}`);
        if (this.shouldRemoteReport) {
            logger_1.default[coreLogLevels.errorId](chalk_1.default `{bold ErrorID:} ${this.metadata.errorId}`);
        }
        if (node_error_report_1.isRequestInfo(this.parsedInfo)) {
            const { method, url } = this.parsedInfo.requestConfig;
            logger_1.default[requestDataLogLevels.requestInfo](chalk_1.default `{bold Request:} ${method} ${url}`);
            if (this.parsedInfo.response) {
                const { status } = this.parsedInfo.response;
                logger_1.default[requestDataLogLevels.requestStatus](chalk_1.default `{bold Status:} ${status.toString()}`);
            }
        }
        return this;
    }
    maybeSendToTelemetry() {
        if (this.shouldRemoteReport && !this.isErrorReported()) {
            TelemetryCollector_1.TelemetryCollector.getCollector().registerError(this);
        }
        return this;
    }
}
exports.ErrorReport = ErrorReport;
