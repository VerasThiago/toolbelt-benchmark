"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const ErrorKinds_1 = require("../../error/ErrorKinds");
const ErrorReport_1 = require("../../error/ErrorReport");
const CustomEventSource_1 = require("../../sse/CustomEventSource");
const logger_1 = tslib_1.__importDefault(require("../../../logger"));
const user_agent_1 = tslib_1.__importDefault(require("../../../user-agent"));
const SessionManager_1 = require("../../session/SessionManager");
const util_1 = require("util");
class AppLogsEventSource {
    constructor({ account, workspace, app, showSeenLogs, userLogged }) {
        this.account = account;
        this.app = app;
        this.userAgent = `${user_agent_1.default}${showSeenLogs ? `#${crypto_1.randomBytes(8).toString('hex')}` : `#${userLogged}`}`;
        this.uri = `http://infra.io.vtex.com/skidder/v${AppLogsEventSource.SKIDDER_MAJOR}/${account}/${workspace}/logs/stream`;
        if (app) {
            this.uri += `/${app}`;
        }
    }
    static createDefault({ app, showSeenLogs }) {
        const { account, workspace, userLogged } = SessionManager_1.SessionManager.getSingleton();
        return new AppLogsEventSource({
            account,
            workspace,
            app,
            showSeenLogs,
            userLogged,
        });
    }
    createLogEventSource() {
        const es = CustomEventSource_1.CustomEventSource.create({
            source: this.uri,
            additionalHeaders: {
                'user-agent': this.userAgent,
            },
        });
        const streamLocator = `${this.account}${this.app ? `.${this.app}` : ''}`;
        logger_1.default.info(`Connecting to logs stream for ${streamLocator}`);
        logger_1.default.debug(`Stream URI ${this.uri}`);
        es.onopen = () => {
            logger_1.default.info(`Listening to ${streamLocator}'s logs`);
        };
        es.onerror = err => {
            const rep = ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
                kind: ErrorKinds_1.ErrorKinds.APP_LOGS_SSE_ERROR,
                originalError: err,
            });
            logger_1.default.error(`Error reading logs: ${err.message} - [ErrorID: ${rep.metadata.errorId}]`);
        };
        es.addEventListener('message', msg => {
            try {
                logger_1.default.info(util_1.inspect(JSON.parse(msg.data).data, true, 4, true));
            }
            catch (e) {
                logger_1.default.error(e, msg.data);
                ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
                    kind: ErrorKinds_1.ErrorKinds.APP_LOGS_PARSE_ERROR,
                    originalError: e,
                });
            }
        });
    }
}
exports.AppLogsEventSource = AppLogsEventSource;
AppLogsEventSource.SKIDDER_MAJOR = 1;
