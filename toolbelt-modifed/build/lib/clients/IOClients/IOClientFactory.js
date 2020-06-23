"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const env = tslib_1.__importStar(require("../../../env"));
const user_agent_1 = tslib_1.__importDefault(require("../../../user-agent"));
const Headers_1 = require("../../constants/Headers");
const SessionManager_1 = require("../../session/SessionManager");
const traceConfig_1 = require("../../globalConfigs/traceConfig");
const noop = () => { };
class IOClientFactory {
    static createDummyLogger() {
        const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
        return {
            account,
            workspace,
            operationId: '',
            requestId: '',
            debug: noop,
            info: noop,
            warn: noop,
            error: noop,
            sendLog: noop,
        };
    }
    static createIOContext(opts) {
        const session = SessionManager_1.SessionManager.getSingleton();
        const { account = session.account, authToken = session.token, region = env.region(), workspace = session.workspace || 'master', } = opts !== null && opts !== void 0 ? opts : {};
        return {
            account,
            userAgent: user_agent_1.default,
            workspace,
            authToken,
            region,
            production: false,
            product: '',
            route: {
                id: '',
                params: {},
            },
            requestId: '',
            operationId: '',
            platform: '',
            logger: IOClientFactory.createDummyLogger(),
        };
    }
    static createClient(ClientClass, customContext = {}, customOptions = {}) {
        const clusterHeader = env.cluster() ? { [Headers_1.Headers.VTEX_UPSTREAM_TARGET]: env.cluster() } : null;
        const traceHeader = traceConfig_1.TraceConfig.shouldTrace() ? { [Headers_1.Headers.VTEX_TRACE]: traceConfig_1.TraceConfig.jaegerDebugID } : null;
        const defaultOptions = {
            timeout: (env.envTimeout || IOClientFactory.DEFAULT_TIMEOUT),
            headers: {
                ...clusterHeader,
                ...traceHeader,
            },
        };
        const mergedOptions = { ...defaultOptions, ...customOptions };
        mergedOptions.headers = { ...defaultOptions.headers, ...customOptions.headers };
        const ioContext = {
            ...IOClientFactory.createIOContext(),
            ...customContext,
        };
        if (!ioContext.authToken) {
            return new Proxy({}, {
                get: () => () => {
                    throw new Error(`Error trying to call client before login.`);
                },
            });
        }
        return new ClientClass({
            ...IOClientFactory.createIOContext(),
            ...customContext,
        }, mergedOptions);
    }
}
exports.IOClientFactory = IOClientFactory;
IOClientFactory.DEFAULT_TIMEOUT = 15000;
